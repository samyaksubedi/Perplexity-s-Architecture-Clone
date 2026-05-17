import express, { Router } from 'express';

import {
  signUp,
  resendVerificationToken,
  verifyUser,
  signIn,
  logoutUser,
} from '../Controllers/auth.controller.js';
import { validate } from '../Middlewares/validate.middleware.js';
import { signUpReqBodySchema } from '../Schemas/user.schema.js';

const router = express.Router();
router.get('/', (req, res) => {
  res.send('Working !!');
});
router.post('/signUp', validate(signUpReqBodySchema), signUp);
router.post('/resend-verification', resendVerificationToken);
router.post('/verify/:token', verifyUser);
router.post('/signIn', signIn);
router.post('/logout', logoutUser);

// router.post('/testGM', testGM);

export default router;
