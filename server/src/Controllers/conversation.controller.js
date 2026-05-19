import { llm } from '../Configs/llm.config.js';
import { prompt } from '../Prompts/conversation.prompt.js';
import { parallelSearchWeb } from '../Services/websearch.service.js';
import { ApiError } from '../UTILS/API/error.api.js';
import { ApiResponse } from '../UTILS/API/response.api.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { redis } from '../Configs/redis.config.js';
import { generateCacheKey } from '../Services/redis.service.js';

const parser = new JsonOutputParser();

const ask = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json(new ApiError(400, 'query is required'));
    }

    // ✅ STEP 1: Check Redis cache first
    const cacheKey = generateCacheKey(query);
    const cachedResponse = await redis.get(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit ✅ returning cached response');
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedResponse),
            'AI responded successfully (cached)',
          ),
        );
    }
    console.log('Cache miss ❌ running full pipeline');

    // STEP 2: Generate sub queries
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

    // STEP 3: Parallel web search
    const parallelWebSearchResults = await parallelSearchWeb(subQueries);

    // STEP 4: Extract + deduplicate sources and contents
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

    // STEP 5: Hit the LLM
    const chain = prompt.pipe(llm).pipe(parser);
    const llmResponse = await chain.invoke({
      webSearchResults: webContentsArray,
      userQuery: query,
    });

    // ✅ STEP 6: Save to Redis before returning (TTL: 1 hour)
    const responseToCache = { llmResponse, sources: sourcesArray };
    await redis.set(cacheKey, JSON.stringify(responseToCache), 'EX', 3600);
    console.log('Response cached ✅');

    return res
      .status(200)
      .json(new ApiResponse(200, responseToCache, 'AI responded successfully'));
  } catch (error) {
    console.error('Internal Server Error at /ask ', error.message);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error at /ask'));
  }
};

const ask_followup = async (req, res) => {};
const getConversations = async (req, res) => {};
const getConversation = async (req, res) => {};

export { ask, ask_followup, getConversations, getConversation };
