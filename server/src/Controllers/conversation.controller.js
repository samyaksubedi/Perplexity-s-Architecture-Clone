import { llm } from '../Configs/llm.config.js';
import { prompt } from '../Prompts/conversation.prompt.js';
import { searchWeb } from '../Services/websearch.service.js';
import { ApiError } from '../UTILS/API/error.api.js';
import { ApiResponse } from '../UTILS/API/response.api.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';

const parser = new JsonOutputParser(); // since my prompt returns { answer, followUps }

const purplexity_ask = async (req, res) => {
  try {
    // Get the query from the user
    const query = req.body?.query;
    if (!query) {
      return res.status(400).json(new ApiError(400, 'query is required'));
    }

    //   make sure user has access/credits to hit the endpoint
    //   check if we have web search indexed for a similar query
    // if not do some web search to gather sources
    const webSearchResults = await searchWeb(query);
    // console.log(webSearchResults);

    // send back sources as links in the response
    const sources = []; // List of URLs
    webSearchResults['results'].forEach((result) => {
      sources.push(result['url']);
    });

    //   do some context engineering on the prompt + web search responses
    // build the chain once — prompt | llm | parser
    const chain = prompt.pipe(llm).pipe(parser);

    //  hit the LLM
    // single invoke replaces formatMessages + llm.invoke separately
    const llmResponse = await chain.invoke({
      webSearchResults: webSearchResults,
      userQuery: query,
    });

    // llmResponse is now a clean JS object: { answer: "...", followUps: [...] }
    //  stream back the response
    // Send follow ups question
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { llmResponse, sources },
          'AI responded successfully',
        ),
      );
  } catch (error) {
    console.error('Internal Server Error at purplexity_ask ', error.message);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error at purplexity_ask'));
  }
};

// Ask follow up questions
const purplexity_ask_followup = async (req, res) => {};

// get past conversations
const getConversations = async (req, res) => {};

// get past conversation
const getConversation = async (req, res) => {};

export {
  purplexity_ask,
  purplexity_ask_followup,
  getConversations,
  getConversation,
};
