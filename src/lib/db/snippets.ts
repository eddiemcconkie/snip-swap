import { commentSchema } from '$lib/schema/commented';
import { snippetSchema, snippetWithLatestComment, userWithSnippets } from '$lib/schema/snippet';
import { z } from 'zod';
import { surql, type Surreal } from './surreal';

export async function getSnippet(db: Surreal, snippetId: string) {
  const [snippet] = await db.query(
    surql`
      SELECT *
      FROM type::thing('snippet', ${snippetId})
      ORDER BY time.created DESC
      FETCH collection, language, owner
    `,
    snippetSchema.array(),
  );

  return { snippet };
}

export async function getSnippets(db: Surreal) {
  const [snippets] = await db.query(
    surql`
      SELECT
        *,
        (
          SELECT <-commented AS commented
          FROM $parent
          LIMIT 1
          FETCH commented, commented.owner
        )[0].commented[0] AS latestComment
      FROM snippet
      ORDER BY time.created DESC
      FETCH collection, language, owner
    `,
    snippetWithLatestComment.array(),
  );

  console.log(snippets.ok && snippets.result);

  return { snippets };
}

export async function getUserWithSnippets(db: Surreal, username: string) {
  const [user] = await db.query(
    surql`
      SELECT *, ->posted->snippet AS snippets
      FROM auth_user
      WHERE username = type::string(${username})
      FETCH snippets, snippets.language
    `,
    userWithSnippets.array(),
  );

  return { user };
}

export async function addCommentToSnippet(db: Surreal, snippetId: string, comment: string) {
  const [$snippet, $comment, newComment] = await db.query(
    surql`
    LET $snippet = SELECT id FROM type::thing('snippet', ${snippetId});
    LET $comment = (
      RELATE $auth->commented->$snippet SET comment = type::string(${comment})
    );
    SELECT * FROM $comment FETCH owner;
  `,
    z.null(),
    z.null(),
    commentSchema.array(),
  );

  return { comment: newComment };
}
