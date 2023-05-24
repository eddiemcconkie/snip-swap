import { z } from 'zod';
import { record } from './id';

export const userSchema = z.object({
  id: record(),
  username: z.string(),
  name: z.string(),
  avatar: z.string(),
  joined: z.string().datetime(),
});
export const sessionSchema = z.object({
  id: record(),
  user_id: record(),
  active_expires: z.number(),
  idle_expires: z.number(),
});
export const keySchema = z.object({
  id: record(),
  user_id: record(),
  primary_key: z.boolean(),
  hashed_password: z.string().nullable(),
  expires: z.number().nullable(),
});
export type UserSchema = z.infer<typeof userSchema>;
