import express, { Router } from 'express';
import { signIn, signUp } from '../Controllers/auth.controller.js';

const router = express.Router();

router.post('/signIn', signIn);
router.post('/signUp', signUp);

export default router;
