import { commentSchema } from '$lib/schema/commented';
import { snippetSchema, userWithSnippets } from '$lib/schema/snippet';
import { surql, type Surreal } from './surreal';

export async function getSnippet(db: Surreal, snippetId: string) {
  const [snippet] = await db.query(
    surql`
      RETURN (
        SELECT *
        FROM type::thing('snippet', ${snippetId})
        ORDER BY time.created DESC
        FETCH collection, language, owner
      )[0]
    `,
    snippetSchema.nullable(),
  );

  return { snippet };
}

// export async function getSnippets(db: Surreal) {
//   const [snippets] = await db.query(
//     surql`
//       SELECT
//         *,
//         (
//           SELECT <-commented AS commented
//           FROM $parent
//           LIMIT 1
//           FETCH commented, commented.owner
//         )[0].commented[0] AS latestComment
//       FROM snippet
//       ORDER BY time.created DESC
//       FETCH collection, language, owner
//     `,
//     snippetWithLatestComment.array(),
//   );

//   return { snippets };
// }

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
  // const [$snippet, $comment, newComment] = await db.query(
  const [newComment] = await db.query(
    surql`
      RETURN {
        LET $snippet = SELECT id FROM type::thing('snippet', ${snippetId});
        LET $comment = (
          RELATE $auth->commented->$snippet SET comment = type::string(${comment})
        );
        RETURN (SELECT * FROM $comment FETCH owner);
      }
    `,
    commentSchema.array(),
  );

  return { comment: newComment };
}

export async function getSnippetComments(db: Surreal, snippetId: string) {
  const [comments] = await db.query(
    surql`
    RETURN (
      SELECT <-commented AS comments
      FROM type::thing('snippet', ${snippetId})
      FETCH comments, comments.owner
    )[0].comments
    `,
    commentSchema.array(),
  );

  return { comments };
}
