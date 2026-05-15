import dotenv from 'dotenv';
dotenv.config();
const loadEnv = async () => {
  console.log('ENV loaded successfully');
};

const envVariables = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  PORT: process.env.PORT,
};

export { envVariables, loadEnv };
