import express from 'express';
import conversationRouter from './Routers/conversation.router.js';
import authRouter from './Routers/auth.router.js';
import userRouter from './Routers/user.router.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.get('/api', async (req, res) => {
  res.send({ message: 'Server is serving' });
});
app.use('/api/conversation', conversationRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export { app };
