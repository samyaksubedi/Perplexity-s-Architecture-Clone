import express, { Router } from 'express';
import { signIn, signUp, testWA } from '../Controllers/auth.controller.js';

const router = express.Router();
router.get('/', (req, res) => {
  res.send('Working !!');
});
router.post('/signIn', signIn);
router.post('/signUp', signUp);

export default router;
