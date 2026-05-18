import express from 'express';
import { authenticateUser } from '../Middlewares/auth.middleware.js';
import { getMe } from '../Controllers/user.controller.js';

const router = express.Router();
router.get('/', (req, res) => {
  res.send('Working !!');
});
router.get('/getMe', authenticateUser, getMe);

export default router;
