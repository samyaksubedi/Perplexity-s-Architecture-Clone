import express, { Router } from 'express';
import { purplexity_ask } from '../Controllers/conversation.controller.js';

const router = express.Router();

router.post('/ask', purplexity_ask);

export default router;
