import { ChatOpenAI } from '@langchain/openai';
import { envVariables } from './env.config.js';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0,
  //   maxTokens: undefined,
  //   timeout: undefined,
  //   maxRetries: 2,
  apiKey: envVariables.OPENAI_API_KEY,
  // other params...
});

export { llm };
