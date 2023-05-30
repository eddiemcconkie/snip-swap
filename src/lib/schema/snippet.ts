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
  mine: z.boolean(),
  public: z.boolean().default(true),
  saved: z.boolean(),
  saveCount: z.number(),
  commentCount: z.number(),
  time: z.object({
    created: z.string().datetime(),
    updated: z.string().datetime().optional(),
  }),
});
export type SnippetSchema = z.infer<typeof snippetSchema>;

export const snippetFetchLanguage = snippetSchema.merge(z.object({ language: languageSchema }));

export const snippetFetchUserLanguage = snippetSchema.merge(
  z.object({ owner: userSchema, language: languageSchema }),
);
export type SnippetFetchUserLanguage = z.infer<typeof snippetFetchUserLanguage>;
