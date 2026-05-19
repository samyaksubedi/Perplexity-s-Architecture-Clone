import express, { Router } from 'express';
import {
  ask,
  ask_followup,
  getConversations,
  getConversation,
} from '../Controllers/conversation.controller.js';
import { validate } from '../Middlewares/validate.middleware.js';
import { askReqBodySchema } from '../Schemas/conversation.schema.js';

const router = express.Router();

router.post('/ask', validate(askReqBodySchema), ask);
router.post('/followup', ask_followup);
router.get('/', getConversations);
router.get('/:conversationId', getConversation);

export default router;
