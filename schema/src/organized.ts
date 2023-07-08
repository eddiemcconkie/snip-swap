import { z } from 'zod';
import { edgeSchema } from './edge';
import { record } from './id';

export const organizedSchema = z.object({
  id: record(),
});
export const organizedEdgeSchema = organizedSchema.merge(edgeSchema);
