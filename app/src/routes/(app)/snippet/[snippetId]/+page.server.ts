import {
  addSnippetToCollection,
  createCollection,
  getCollection,
  getCollectionByName,
  removeSnippetFromCollection,
} from '$lib/data/collections.js';
import { addCommentToSnippet, getSnippet } from '$lib/data/snippets.js';
import {
  collectionSchema,
  commentSchema,
  savedSchema,
  type CollectionSchema,
} from '@snipswap/schema';
import { surql } from '@snipswap/surreal';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export async function load({ locals: { auth, db }, params }) {
  const { user } = await auth.validateUser();

  const { snippet } = await getSnippet(db, params.snippetId);
  if (!snippet.ok) {
    throw error(500, 'something went wrong');
  }
  if (!snippet.result) {
    throw error(404);
  }

  return { user, snippet: snippet.result };
}

export const actions = {
  async save({ locals: { auth, db }, params }) {
    const { session } = await auth.validateUser();
    if (!session) throw error(403);

    const [$snippet, relation] = await db.query(
      surql`
      BEGIN;
      LET $snippet = (SELECT * FROM type::thing('snippet', ${params.snippetId}));
      RELATE $auth->saved->$snippet;
      COMMIT;
    `,
      z.null(),
      savedSchema.array(),
    );

    if (!relation.ok) {
      throw error(500, 'could not save');
    }
  },

  async unsave({ locals: { auth, db }, params }) {
    const { session } = await auth.validateUser();
    if (!session) throw error(403);

    const [del, cancel] = await db.query(
      surql`
        BEGIN;

        DELETE saved
        WHERE out = type::thing('snippet', ${params.snippetId});
        --in = $auth
          --AND 

        IF fn::record_exists('snippet', ${params.snippetId}) = false THEN
          (CREATE cancel)
        END;
        
        COMMIT;
      `,
      // surql`
      //   BEGIN;
      //   DELETE FROM $authW->saved
      //   WHERE out = type::thing('snippet', ${params.snippetId});
      //   IF fn::record_exists('snippet', ${params.snippetId}) = false THEN
      //     (CREATE cancel) END;
      //   COMMIT;
      // `,
      z.any(),
      z.any(),
    );
    if (!del.ok) {
      throw error(500, 'could not unsave');
    }
  },

  async addToNewCollection({ locals: { auth, db }, params, request }) {
    const { session } = await auth.validateUser();
    if (!session) return fail(403, { error: "you're not signed in" });

    const form = await superValidate(request, collectionSchema.pick({ name: true }));
    if (!form.valid) {
      return fail(400, { name: form.data.name, error: form.errors.name?.[0] });
    }

    const { collection: existingCollection } = await getCollectionByName(db, form.data.name);
    if (!existingCollection.ok) {
      throw error(500, 'something went wrong');
    }

    let collection: CollectionSchema;
    if (existingCollection.result) {
      collection = existingCollection.result;
    } else {
      const { collection: newCollection } = await createCollection(db, form.data.name);

      if (!newCollection.ok || newCollection.count !== 1) {
        throw error(500, 'something went wrong');
      }
      collection = newCollection.result[0];
    }

    const { saved } = await addSnippetToCollection(db, collection.id, params.snippetId);
    if (!saved.ok) {
      throw error(500);
    }

    return { collection };
  },

  async addToCollection({ locals: { auth, db }, params, url }) {
    const { session } = await auth.validateUser();
    if (!session) return fail(403, { error: "you're not signed in" });

    const collectionId = url.searchParams.get('collectionId');

    if (!collectionId) {
      return fail(400, { error: 'please specify a collection id' });
    }

    const { collection } = await getCollection(db, collectionId);
    if (!collection.ok) {
      throw error(500, 'something went wrong');
    }
    if (!collection.result) {
      return fail(400, { error: "that collection doesn't exist" });
    }

    const { saved } = await addSnippetToCollection(db, collectionId, params.snippetId);
    if (!saved.ok) {
      throw error(500);
    }

    // return { name: collection.result.name };
    return { collection: collection.result };
  },

  async removeCollection({ locals: { auth, db }, params }) {
    const { session } = await auth.validateUser();
    if (!session) return fail(403, { error: "you're not signed in" });

    const { update } = await removeSnippetFromCollection(db, params.snippetId);
    if (!update.ok) {
      throw error(500, 'something went wrong');
    }
    if (update.count !== 1) {
      return fail(400, { error: "the snippet couldn't be updated" });
    }
  },

  async addComment({ locals: { auth, db }, params, request }) {
    const { session } = await auth.validateUser();
    if (!session) return fail(403, { error: "you're not signed in" });

    // const data = await request.formData()
    // const comment = data.get('comment')
    const form = await superValidate(request, commentSchema.pick({ comment: true }));

    if (!form.valid) {
      return fail(400, { error: form.errors.comment?.[0] ?? 'invalid' });
    }

    const { comment } = await addCommentToSnippet(db, params.snippetId, form.data.comment);

    if (!comment.ok || comment.count !== 1) {
      throw error(500, 'something went wrong');
    }

    return { comment: comment.result! };
  },
};
