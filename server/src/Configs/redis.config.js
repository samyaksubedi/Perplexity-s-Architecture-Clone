import Redis from 'ioredis';
import { envVariables } from './env.config.js';

const redis = new Redis(envVariables.REDIS_URL || 'redis://localhost:6379');

export { redis };

