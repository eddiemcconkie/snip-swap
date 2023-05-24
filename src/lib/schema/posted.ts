import { z } from 'zod';
import { record } from './id';

export const postedSchema = z.object({
  id: record(),
  in: record(),
  out: record(),
});
