import { z } from 'zod';
import { userSchema } from './auth';
import { collectionSchema } from './collection';
import { commentSchema } from './commented';
import { firstOrNull, record } from './id';
import { languageSchema } from './language';

// function getFirst<T>(array: T[] | undefined): T | undefined {
//   if (array === undefined) return array;
//   return array.at(0);
// }
function getFirst<T>(array: T[]): T | null {
  if (array === undefined) return array;
  return array.at(0) ?? null;
}

function arrayFirstOrNull<T extends z.ZodTypeAny>(schema: T) {
  return schema.array().transform(getFirst).nullable();
}

export const snippetSchema = z.object({
  id: record(),
  code: z.string().trim().min(1),
  description: z.string().trim(),
  mine: z.boolean(),
  public: z.boolean().default(true),
  saved: z.boolean(),
  saveCount: z.number(),
  commentCount: z.number(),
  // highlightedComment: firstNullableRecord(),
  time: z.object({
    created: z.string().datetime(),
    updated: z.string().datetime().optional(),
    since: z.string(),
  }),
  // Fetch these
  collection: collectionSchema.nullable().array().transform(firstOrNull),
  language: languageSchema,
  owner: userSchema,
});
export type SnippetSchema = z.infer<typeof snippetSchema>;

export const userWithSnippets = userSchema.merge(z.object({ snippets: snippetSchema.array() }));

export const snippetWithLatestComment = snippetSchema.merge(
  z.object({
    latestComment: commentSchema.nullable(),
  }),
);
export type SnippetWithLatestComment = z.infer<typeof snippetWithLatestComment>;

// export const snippetFetchLanguage = snippetSchema.merge(z.object({ language: languageSchema }));

// export const snippetFetchAll = snippetSchema.merge(
//   z.object({
//     owner: userSchema,
//     language: languageSchema,
//     collection: collectionSchema.nullable().array().transform(firstOrNull),
//   }),
// );
// export type SnippetFetchAll = z.infer<typeof snippetFetchAll>;
