import { z } from 'zod';
import { record } from './id';

export const edgeSchema = z.object({
  in: record(),
  out: record(),
});
