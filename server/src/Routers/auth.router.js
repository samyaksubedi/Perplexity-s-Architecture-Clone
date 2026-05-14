import express, { Router } from 'express';
import { signIn, signUp } from '../Controllers/auth.controller.js';

const router = express.Router();

router.post('/ask', purplexity_ask);
router.post('/followup', purplexity_ask_followup);

export default router;
