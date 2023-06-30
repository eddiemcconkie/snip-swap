import { z } from 'zod';
import { edgeSchema } from './edge';
import { record } from './id';

export const savedSchema = z.object({
  id: record(),
  collection: record().optional(),
});
export const savedEdgeSchema = savedSchema.merge(edgeSchema);
