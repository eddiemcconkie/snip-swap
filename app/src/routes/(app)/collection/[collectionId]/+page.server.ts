import { surql } from '$lib/db/surreal.js';
import { collectionSchema } from '$lib/schema/collection.js';
import { snippetSchema } from '$lib/schema/snippet.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { auth, db }, params }) {
  const { user } = await auth.validateUser();
  if (!user) throw redirect(302, '/');

  const [collection] = await db.query(
    surql`SELECT * FROM type::thing('collection', ${params.collectionId})`,
    collectionSchema.array(),
  );
  if (!collection.ok || collection.count !== 1) throw redirect(302, '/');

  const [snippets] = await db.query(
    surql`
      SELECT VALUE 
        ->saved[WHERE collection = type::thing('collection', ${params.collectionId})]->snippet AS snippets 
      FROM $auth
    `,
    snippetSchema.array(),
  );
  if (!snippets.ok)
    throw error(500, 'there was a problem loading the snippets for that collection');

  return { user, collection: collection.result[0], snippets: snippets.result };
}
