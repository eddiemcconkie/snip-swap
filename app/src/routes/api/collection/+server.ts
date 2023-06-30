import { createCollection, getCollections } from '$lib/db/collections.js';
import type { Get } from '$lib/fetch/get';
import { parseBody, type Post } from '$lib/fetch/post';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  // const db = connect(event.locals.surrealToken);
  // const [collections] = await db.query(surql`SELECT * FROM collection`, collectionSchema.array());
  // const [collections] = await db.query(
  //   surql`SELECT VALUE ->organized->collection FROM $auth`,
  //   collectionSchema.array(),
  // );

  const { collections } = await getCollections(event.locals.db);

  // await wait(2000);

  if (!collections.ok) {
    throw error(500, collections.error);
  }

  return json({ collections: collections.result } satisfies Get<typeof event>);
}

export async function POST(event) {
  const { name } = await parseBody(event);

  // const [collection] = await db.query(
  //   surql`
  //     BEGIN;
  //     LET $newCollection = (CREATE collection SET name = type::string(${name}));
  //     RELATE $auth->organized->$newCollection;
  //     COMMIT;
  //   `,
  //   collectionSchema.array(),
  //   z.any(),
  // );
  const { collection } = await createCollection(event.locals.db, name);

  if (!collection.ok) {
    throw error(500, collection.error);
  }

  return json({ collection: collection.result } satisfies Post<typeof event>);
}
