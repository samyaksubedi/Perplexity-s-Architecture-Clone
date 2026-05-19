import { z } from 'zod';

const askReqBodySchema = z.object({
  query: z.string(),
});

export { askReqBodySchema };
