import type { Get } from '$lib/fetch/get.js';
import { languageSchema, userSchema } from '@snipswap/schema';
import { surql } from '@snipswap/surreal';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

export async function GET(event) {
  const q = event.url.searchParams.get('q')?.trim().toLowerCase();

  if (!q || q.length === 0) {
    return json({
      languages: [],
      users: [],
      snippets: [],
    } satisfies Get<typeof event>);
  }

  const [$q, languages, users, snippets] = await event.locals.db.query(
    surql`
      LET $q = type::string(${q});

      SELECT *
      FROM language
      -- WHERE name CONTAINS $q
      WHERE string::startsWith(string::lowercase(name), $q)
      ;
      
      SELECT *
      FROM auth_user
      WHERE string::startsWith(string::lowercase(name), $q)
      OR string::startsWith(string::lowercase(username), $q)
      ;

      SELECT *
      FROM snippet
      WHERE string::lowercase(code) CONTAINS $q
      OR string::lowercase(description) CONTAINS $q
      ORDER BY time.created DESC
      FETCH language, owner
      ;
    `,
    z.null(),
    languageSchema.array(),
    userSchema.array(),
    // Don't worry about including the collection
    // snippetSchema.merge(z.object({ collection: record() })).array(),
    z.any(),
  );

  if (!languages.ok || !users.ok || !snippets.ok) {
    throw error(500, 'something went wrong');
  }

  return json({
    languages: languages.result,
    users: users.result,
    snippets: snippets.result,
  } satisfies Get<typeof event>);
}
