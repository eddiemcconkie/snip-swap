import { getLanguage, getSnippets } from '$lib/db/languages.js';
import { getUser } from '$lib/db/users.js';
import type { LanguageSchema } from '$lib/schema/language.js';
import type { SnippetWithLatestComment } from '$lib/schema/snippet.js';
import type { UserSchema } from 'lucia-auth';

export async function load({ locals: { auth, db }, url }) {
  const languageSearch = url.searchParams.get('language');
  const userSearch = url.searchParams.get('user');
  const search = url.searchParams.get('q');

  const { user } = await auth.validateUser();

  let snippets: SnippetWithLatestComment[] = [];

  let queryLanguageData: LanguageSchema | null = null;
  let queryUserData: UserSchema | null = null;

  if (languageSearch) {
    const [{ language: _language }, { snippets: _snippets }] = await Promise.all([
      getLanguage(db, languageSearch),
      getSnippets(db, {
        by: {
          type: 'language',
          languageId: languageSearch,
        },
      }),
    ]);
    if (_language.ok && _snippets.ok) {
      queryLanguageData = _language.result;
      snippets = _snippets.result;
    }
  } else if (userSearch) {
    const [{ user: _user }, { snippets: _snippets }] = await Promise.all([
      getUser(db, userSearch),
      getSnippets(db, {
        by: {
          type: 'user',
          userId: userSearch,
        },
      }),
    ]);
    if (_user.ok && _snippets.ok) {
      queryUserData = _user.result;
      snippets = _snippets.result;
    }
  } else if (search) {
    const { snippets: _snippets } = await getSnippets(db, {
      by: {
        type: 'query',
        query: search,
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

  return { user, snippets, queryLanguageData, queryUserData, search };
}
