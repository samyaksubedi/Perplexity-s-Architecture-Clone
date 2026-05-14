import express from 'express';
import conversationRouter from './Routers/conversation.router.js';

const app = express();

app.use(express.json());
app.get('/api', async (req, res) => {
  res.send({ message: 'Server is serving' });
});
app.use('/api/conversation', conversationRouter);

export { app };
