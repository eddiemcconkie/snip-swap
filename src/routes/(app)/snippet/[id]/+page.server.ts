import { connect, surql } from '$lib/db/surreal.js';
import { snippetFetchUserLanguage } from '$lib/schema/snippet.js';
import { redirect } from '@sveltejs/kit';

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
