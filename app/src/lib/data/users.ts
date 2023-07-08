import { snippetWithLatestComment, userSchema } from '@snipswap/schema';
import { surql, type Surreal } from '@snipswap/surreal';

export async function getUser(db: Surreal, userId: string) {
  const [user] = await db.query(
    surql`
    RETURN (
      SELECT * FROM type::thing('auth_user', ${userId})
    )[0]
  `,
    userSchema.nullable(),
  );

  return { user };
}

export async function getSnippetsByUser(db: Surreal, userId: string) {
  const [snippets] = await db.query(
    surql`
    RETURN (
      SELECT VALUE ->created->snippet FROM type::thing('auth_user', ${userId})
    )[0]
  `,
    snippetWithLatestComment.array().nullable(),
  );

  return { snippets };
}
