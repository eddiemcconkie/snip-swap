import { languageSchema, snippetWithLatestComment } from '@snipswap/schema';
import { SurQL, surql, type Surreal } from '@snipswap/surreal';

export async function getLanguage(db: Surreal, languageId: string) {
  const [language] = await db.query(
    surql`
    RETURN (
      SELECT * FROM type::thing('language', ${languageId})
    )[0]
  `,
    languageSchema.nullable(),
  );

  return { language };
}

// export async function getSnippetsByLanguage(db: Surreal, languageId: string) {
//   const [snippets] = await db.query(
//     snippetsWithLatestComment({
//       where: surql`language = type::thing('language', ${languageId})`,
//     }),
//     snippetWithLatestComment.array().nullable(),
//   );
// }

type By =
  | {
      type: 'language';
      languageId: string;
    }
  | {
      type: 'user';
      userId: string;
    }
  | {
      type: 'query';
      query: string;
    };

export async function getSnippets(
  db: Surreal,
  options?: {
    by?: By;
    before?: string;
    after?: string;
    limit?: number;
  },
) {
  let where: SurQL;
  switch (options?.by?.type) {
    case 'language':
      where = surql`language = type::thing('language', ${options.by.languageId})`;
      break;
    case 'user':
      where = surql`owner = type::thing('auth_user', ${options.by.userId})`;
      break;
    case 'query':
      where = surql`(
        string::lowercase(code) CONTAINS type::string(${options.by.query})
        OR string::lowercase(description) CONTAINS type::string(${options.by.query})
      )`;
      break;
    default:
      where = surql`true`;
  }

  const before = options?.before ? surql`time.created < type::datetime(${options?.before})` : true;
  const after = options?.after ? surql`time.created > type::datetime(${options?.after})` : true;

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
      WHERE type::bool(${where})
        AND type::bool(${before})
        AND type::bool(${after})
      ORDER BY time.created DESC
      LIMIT type::number(${options?.limit ?? 10})
      FETCH collection, language, owner
    `,
    snippetWithLatestComment.array(),
  );

  return { snippets };
}
