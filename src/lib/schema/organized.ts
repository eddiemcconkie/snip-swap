import { z } from 'zod';
import { record } from './id';

export const organizedSchema = z.object({
  id: record(),
  in: record(),
  out: record(),
});
