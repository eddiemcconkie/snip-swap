import { z } from 'zod';
import { userSchema } from './auth';
import { edgeSchema } from './edge';
import { record } from './id';

export const commentSchema = z.object({
  id: record(),
  comment: z.string().trim().min(1, { message: 'comment cannot be empty' }),
  time: z.object({
    created: z.string().datetime(),
    updated: z.string().datetime().optional(),
    since: z.string(),
  }),
  owner: userSchema,
  mine: z.boolean(),
});
const simpleComment = commentSchema.pick({
  id: true,
  comment: true,
  time: true,
  owner: true,
  mine: true,
});
export type CommentSchema = z.infer<typeof commentSchema>;
export type SimpleComment = z.infer<typeof simpleComment>;

export const commentEdgeSchema = commentSchema.merge(edgeSchema);
