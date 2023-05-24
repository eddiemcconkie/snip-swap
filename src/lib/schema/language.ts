import { z } from 'zod';
import { record } from './id';

export const languageSchema = z.object({
  id: record(),
  name: z.string().trim().min(1),
});
