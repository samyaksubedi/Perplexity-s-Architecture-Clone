import { llm } from '../Configs/llm.config.js';
import { prompt } from '../Prompts/conversation.prompt.js';
import { parallelSearchWeb } from '../Services/websearch.service.js';
import { ApiError } from '../UTILS/API/error.api.js';
import { ApiResponse } from '../UTILS/API/response.api.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { redis } from '../Configs/redis.config.js';
import { generateCacheKey } from '../Services/redis.service.js';
import { getUsersConversationContext } from '../Services/llm_context.service.js';
import { prisma } from '../Configs/postgress.config.js';
import { MessageRole } from '@prisma/client';

const parser = new JsonOutputParser();

const ask = async (req, res) => {
  try {
    // ─── 1. EXTRACT REQUEST DATA ─────────────────────────────────────────────
    // query      → what the user asked
    // conversationId → present if follow-up, absent if new conversation
    const { query, conversationId } = req.body;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json(new ApiError(400, 'query is required'));
    }

    // ─── 2. RESOLVE CONVERSATION ─────────────────────────────────────────────
    // If conversationId is provided → validate and use existing conversation
    // If not → auto-create a new conversation with first 50 chars as title
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation) {
        return res
          .status(400)
          .json(new ApiError(400, 'Invalid conversationId'));
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          title: query.slice(0, 50),
          userId: userId,
        },
      });
    }

    // ─── 3. PERSIST USER MESSAGE ──────────────────────────────────────────────
    // Always save the user's message regardless of cache hit or miss
    // This ensures complete conversation history is maintained
    await prisma.message.create({
      data: {
        content: query,
        conversationId: conversation.id,
        role: MessageRole.User,
      },
    });

    // ─── 4. CHECK REDIS CACHE ─────────────────────────────────────────────────
    // Normalize + hash the query to generate a consistent cache key
    // Cache hit → skip the entire pipeline and return instantly
    const cacheKey = generateCacheKey(query);
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
      console.log('Cache hit ✅ returning cached response');

      // Parse cached data and persist assistant message to DB
      // Even on cache hit, we save to DB for conversation history continuity
      const data = JSON.parse(cachedResponse);
      const content = JSON.stringify(data.llmResponse);
      const sources = data.sources;

      await prisma.message.create({
        data: {
          content,
          sources,
          conversationId: conversation.id,
          role: MessageRole.Assistant,
        },
      });

      // Return cached response with conversationId for client-side tracking
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { ...data, conversationId: conversation.id },
            'AI responded successfully (cached)',
          ),
        );
    }

    // ─── 5. FETCH CONVERSATION CONTEXT ───────────────────────────────────────
    // Retrieve last 7 messages from this conversation for follow-up awareness
    // Passed to LLM so it understands what was discussed before
    console.log('Cache miss ❌ running full pipeline');
    const rawContext = await getUsersConversationContext(conversation.id, 7);
    const prevContext =
      rawContext.length > 0
        ? rawContext.map((m) => `${m.role}: ${m.content}`).join('\n')
        : 'No previous conversation history.';

    // ─── 6. GENERATE SUB-QUERIES ──────────────────────────────────────────────
    // Break the user query into 3 specific sub-queries
    // Broader coverage = richer context for the final answer
    const subQueriesRawResponse = await llm.invoke(
      `Break down the following query into exactly 3 specific sub-queries for web search.

Rules:
- Return ONLY a raw JSON array of 3 strings
- No markdown, no code fences, no explanation, no preamble
- Each sub-query should be specific and searchable

Example output:
["sub-query 1", "sub-query 2", "sub-query 3"]

Query: ${query}`,
    );
    const subQueries = await parser.invoke(subQueriesRawResponse);
    console.log('Sub-queries for web search:', subQueries);

    // ─── 7. PARALLEL WEB SEARCH ───────────────────────────────────────────────
    // Fire all 3 Tavily searches simultaneously using Promise.all()
    // Reduces search time from 3x sequential to 1x parallel
    const parallelWebSearchResults = await parallelSearchWeb(subQueries);

    // ─── 8. EXTRACT + DEDUPLICATE RESULTS ────────────────────────────────────
    // Use Sets to automatically remove duplicate URLs and contents
    // that may appear across different sub-query results
    // Then merge all web contents into one clean string for LLM context
    const sources = new Set();
    const webContents = new Set();
    parallelWebSearchResults.forEach((webSearchResults) => {
      webSearchResults['results'].forEach((result) => {
        sources.add(result['url']);
        webContents.add(result['content']);
      });
    });
    const sourcesArray = [...sources];
    const webContentsArray = [...webContents].join('\n\n---\n\n');

    // ─── 9. GENERATE FINAL ANSWER ─────────────────────────────────────────────
    // Feed merged web context + conversation history + user query to LLM
    // Returns { answer, followUps } as defined in the prompt template
    const chain = prompt.pipe(llm).pipe(parser);
    const llmResponse = await chain.invoke({
      webSearchResults: webContentsArray,
      userQuery: query,
      prevContext: prevContext,
    });

    // ─── 10. PERSIST ASSISTANT MESSAGE ────────────────────────────────────────
    // Save the LLM response + sources to DB for conversation history
    await prisma.message.create({
      data: {
        content: JSON.stringify(llmResponse),
        sources: sourcesArray,
        conversationId: conversation.id,
        role: MessageRole.Assistant,
      },
    });

    // ─── 11. CACHE THE RESPONSE ───────────────────────────────────────────────
    // Store in Redis with 1 hour TTL
    // Next identical query skips the entire pipeline and returns instantly
    const responseToCache = { llmResponse, sources: sourcesArray };
    await redis.set(cacheKey, JSON.stringify(responseToCache), 'EX', 3600);
    console.log('Response cached ✅');

    // ─── 12. RETURN RESPONSE ──────────────────────────────────────────────────
    // Always return conversationId so client can send follow-ups
    // against the same conversation
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            llmResponse,
            sources: sourcesArray,
            conversationId: conversation.id,
          },
          'AI responded successfully',
        ),
      );
  } catch (error) {
    console.error('Internal Server Error at /ask ', error.message);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error at /ask'));
  }
};

const getConversations = async (req, res) => {};
const getConversation = async (req, res) => {};

export { ask, getConversations, getConversation };
