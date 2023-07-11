import { getCollections } from '$lib/data/collections.js';
import type { Get } from '$lib/fetch/get';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const { collections } = await getCollections(event.locals.db);

  if (!collections.ok) {
    throw error(500, collections.error);
  }

  return json({ collections: collections.result } satisfies Get<typeof event>);
}
