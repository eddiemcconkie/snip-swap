import { getCollectionSnippets } from '$lib/db/collections.js';
import type { Get } from '$lib/fetch/get.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  // const db = connect(event.locals.surrealToken);
  // const [snippets] = await db.query(
  //   surql`
  //     SELECT VALUE ->saved[WHERE collection = type::string(${event.params.id})]->snippet AS snippets
  //     FROM $auth
  //     FETCH snippets
  //   `,
  //   snippetFetchAll.array(),
  // );
  const { snippets } = await getCollectionSnippets(event.locals.db, event.params.id);

  if (!snippets.ok) {
    throw error(500, snippets.error);
  }

  return json({
    snippets: snippets.result,
  } satisfies Get<typeof event>);
}
