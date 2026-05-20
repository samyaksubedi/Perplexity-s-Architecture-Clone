import { z } from 'zod';

const askReqBodySchema = z.object({
  query: z.string(),
  conversationId: z.string().uuid().optional(),
});

export { askReqBodySchema };
