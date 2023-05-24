import { connect, surql } from '$lib/db/surreal.js';
import { userSchema } from '$lib/schema/auth.js';
import { snippetFetchLanguage } from '$lib/schema/snippet.js';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

const userWithSnippets = userSchema.merge(z.object({ snippets: snippetFetchLanguage.array() }));

export async function load({ locals, params }) {
  const { user } = await locals.auth.validateUser();
  const db = connect(locals.surrealToken);
  const [selectedUser] = await db.query(
    surql`
      SELECT *, ->posted->snippet AS snippets
      FROM auth_user
      WHERE username = type::string(${params.username})
      FETCH snippets, snippets.language
    `,
    userWithSnippets.array(),
  );
  if (!selectedUser.ok || selectedUser.count !== 1) throw redirect(302, '/');

  return { user, selectedUser: selectedUser.result[0] };
}
