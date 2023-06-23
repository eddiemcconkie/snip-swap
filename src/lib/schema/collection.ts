import { z } from 'zod';
import { record } from './id';

export const collectionSchema = z.object({
  id: record(),
  name: z
    .string()
    .trim()
    .min(1, { message: 'name cannot be empty' })
    .max(30, { message: 'name is too long' }),
  owner: record(),
});

export type CollectionSchema = z.infer<typeof collectionSchema>;
