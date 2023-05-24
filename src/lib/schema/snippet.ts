import { z } from 'zod';
import { userSchema } from './auth';
import { record } from './id';
import { languageSchema } from './language';

export const snippetSchema = z.object({
  id: record(),
  code: z.string().trim().min(1),
  description: z.string().trim(),
  language: record(),
  owner: record(),
  public: z.boolean().default(true),
  time: z.object({
    created: z.string().datetime(),
    updated: z.string().datetime().optional(),
  }),
});

export const snippetFetchLanguage = snippetSchema.merge(z.object({ language: languageSchema }));

export const snippetFetchUserLanguage = snippetSchema.merge(
  z.object({ owner: userSchema, language: languageSchema }),
);
