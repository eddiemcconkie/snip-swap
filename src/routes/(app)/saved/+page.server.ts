import { surql } from '$lib/db/surreal.js';
import { userSchema } from '$lib/schema/auth.js';

export async function load({ locals: { auth, db } }) {
  const { user } = await auth.validateUser();
  if (user) {
    const [users] = await db.query(surql`SELECT * FROM auth_user`, userSchema.array());
    return { user, users };
  }
  return { user };
}
