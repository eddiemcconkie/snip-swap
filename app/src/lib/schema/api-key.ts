import { z } from 'zod';
import { record } from './id';

export const apiKeySchema = z.object({
  id: record(),
  prefix: z.string(),
  time: z.object({
    created: z.string().datetime(),
    since: z.string(),
  }),
});

export type ApiKeySchema = z.infer<typeof apiKeySchema>;
