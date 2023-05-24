import { z } from 'zod';
import { record } from './id';

export const collectionSchema = z.object({
  id: record(),
  name: z.string().trim().min(1),
  owner: record(),
});
