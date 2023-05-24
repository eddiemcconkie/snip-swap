import { z } from 'zod';
import { record } from './id';

export const commentedSchema = z.object({
  id: record(),
  in: record(),
  out: record(),
});
