import { connect, surql } from '$lib/db/surreal.js';
import { userSchema } from '$lib/schema/auth.js';

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  const db = connect(locals.surrealToken);
  if (user) {
    const [users] = await db.query(surql`SELECT * FROM auth_user`, userSchema.array());
    return { user, users };
  }
  return { user };
}
