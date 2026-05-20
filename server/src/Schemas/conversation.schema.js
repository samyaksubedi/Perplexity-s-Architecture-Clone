import { z } from 'zod';
import { id } from 'zod/v4/locales';

const askReqBodySchema = z.object({
  query: z.string(),
  conversationId: z.string().uuid().optional(),
});
const getConversationReqParamsSchema = z.object({
  conversationId: z.string().uuid(),
});

export { askReqBodySchema, getConversationReqParamsSchema };
