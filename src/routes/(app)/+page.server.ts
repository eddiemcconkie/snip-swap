import { connect, surql } from '$lib/db/surreal.js';
import { snippetFetchUserLanguage } from '$lib/schema/snippet.js';

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  const db = connect(locals.surrealToken);
  const [snippets] = await db.query(
    surql`SELECT * FROM snippet FETCH owner, language`,
    snippetFetchUserLanguage.array(),
  );
  return { user, snippets: snippets.ok ? snippets.result : [] };
}
