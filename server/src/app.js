import express from 'express';
import conversationRouter from './Routers/conversation.router.js';
import authRouter from './Routers/auth.router.js';

const app = express();

app.use(express.json());
app.get('/api', async (req, res) => {
  res.send({ message: 'Server is serving' });
});
app.use('/api/conversation', conversationRouter);
app.use('/api/auth', authRouter);

export { app };
