import { connect, surql } from '$lib/db/surreal.js';
import { savedSchema } from '$lib/schema/saved.js';
import { snippetFetchUserLanguage } from '$lib/schema/snippet.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

export async function load({ locals, params }) {
  const { user } = await locals.auth.validateUser();
  const db = connect(locals.surrealToken);
  const [snippet] = await db.query(
    surql`SELECT * FROM type::thing('snippet', type::string(${params.id})) FETCH owner, language`,
    snippetFetchUserLanguage.array(),
  );
  if (!snippet.ok || snippet.count !== 1) throw redirect(302, '/');

  return { user, snippet: snippet.result[0] };
}

export const actions = {
  async save({ locals, params }) {
    const { session } = await locals.auth.validateUser();
    if (!session) return fail(403);

    const db = connect(locals.surrealToken);
    await db.query(
      surql`
      BEGIN;
      LET $snippet = (SELECT * FROM type::thing('snippet', ${params.id}));
      RELATE $auth->saved->$snippet;
      COMMIT;
    `,
      z.null(),
      savedSchema.array(),
    );
  },
  async unsave({ locals, params }) {
    const { session } = await locals.auth.validateUser();
    if (!session) return fail(403);

    const db = connect(locals.surrealToken);
    await db.query(surql`
      DELETE saved
      WHERE in = $auth
        AND out = type::thing('snippet', ${params.id});
    `);
  },
};
