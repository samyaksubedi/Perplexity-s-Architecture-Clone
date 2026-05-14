import express, { Router } from 'express';
import {
  purplexity_ask,
  purplexity_ask_followup,
  getConversations,
  getConversation,
} from '../Controllers/conversation.controller.js';

const router = express.Router();

router.post('/ask', purplexity_ask);
router.post('/followup', purplexity_ask_followup);
router.get('/', getConversations);
router.get('/:conversationId', getConversation);

export default router;
