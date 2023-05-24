import { z } from 'zod';
import { record } from './id';

export const savedSchema = z.object({
  id: record(),
  in: record(),
  out: record(),
  collection: record().optional(),
});
