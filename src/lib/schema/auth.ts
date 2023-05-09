import { z } from 'zod';
import { idWithoutTable } from './id';

export const userSchema = z.object({
  id: idWithoutTable(),
  username: z.string(),
  name: z.string(),
  avatar: z.string(),
  joined: z.string().datetime(),
});
export const sessionSchema = z.object({
  id: idWithoutTable(),
  user_id: idWithoutTable(),
  active_expires: z.number(),
  idle_expires: z.number(),
});
export const keySchema = z.object({
  id: idWithoutTable(),
  user_id: idWithoutTable(),
  primary_key: z.boolean(),
  hashed_password: z.string().nullable(),
  expires: z.number().nullable(),
});
export type UserSchema = z.infer<typeof userSchema>;
