import { getLanguage, getSnippets } from '$lib/data/languages.js';
import { getUser } from '$lib/data/users.js';
import { parseSearchParameters } from '$lib/fetch/search';
import type { LanguageSchema, SnippetWithLatestComment } from '@snipswap/schema';
import type { UserSchema } from 'lucia-auth';

export async function load({ locals: { auth, db }, url }) {
  const { user } = await auth.validateUser();

  const search = parseSearchParameters(url, ['language', 'user', 'q']);

  let snippets: SnippetWithLatestComment[] = [];

  let queryLanguageData: LanguageSchema | null = null;
  let queryUserData: UserSchema | null = null;

  if (search.language) {
    const [{ language: _language }, { snippets: _snippets }] = await Promise.all([
      getLanguage(db, search.language),
      getSnippets(db, {
        by: {
          type: 'language',
          languageId: search.language,
        },
      }),
    ]);
    if (_language.ok && _snippets.ok) {
      queryLanguageData = _language.result;
      snippets = _snippets.result;
    }
  } else if (search.user) {
    const [{ user: _user }, { snippets: _snippets }] = await Promise.all([
      getUser(db, search.user),
      getSnippets(db, {
        by: {
          type: 'user',
          userId: search.user,
        },
      }),
    ]);
    if (_user.ok && _snippets.ok) {
      queryUserData = _user.result;
      snippets = _snippets.result;
    }
  } else if (search.q) {
    const { snippets: _snippets } = await getSnippets(db, {
      by: {
        type: 'query',
        query: search.q,
      },
    });
    if (_snippets.ok) {
      snippets = _snippets.result;
    }
  } else {
    const { snippets: _snippets } = await getSnippets(db);
    if (_snippets.ok) {
      snippets = _snippets.result;
    }
  }

  return { user, snippets, queryLanguageData, queryUserData, search: search.q };
}
