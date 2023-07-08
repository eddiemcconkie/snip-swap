import { getCollectionSnippets } from '$lib/data/collections.js';
import type { Get } from '$lib/fetch/get.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const { snippets } = await getCollectionSnippets(event.locals.db, event.params.collectionId);

  if (!snippets.ok) {
    throw error(500, snippets.error);
  }

  return json({
    snippets: snippets.result,
  } satisfies Get<typeof event>);
}
