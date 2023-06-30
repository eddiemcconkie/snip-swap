import { z } from 'zod';
import { record } from './id';

export const followsSchema = z.object({
  id: record(),
  in: record(),
  out: record(),
});
