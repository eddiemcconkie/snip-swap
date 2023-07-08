import { getCollections } from '$lib/data/collections.js';
import { languageSchema, snippetSchema } from '@snipswap/schema';
import { surql } from '@snipswap/surreal';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export async function load({ locals: { auth, db }, url }) {
  const { user } = await auth.validateUser();
  if (user) {
    const language = url.searchParams.get('language');
    const [[snippets, languageCounts], { collections }] = await Promise.all([
      db.query(
        surql`
          SELECT * FROM (
            SELECT ->saved->snippet AS snippets
            FROM $auth
            FETCH snippets, snippets.owner, snippets.collection, snippets.language
          )[0].snippets
          WHERE type::bool(${
            language ? surql`language.id = type::thing('language', ${language})` : surql`true`
          })
          ;
          
          SELECT
            ->saved->snippet.language AS language,
            count(->saved->snippet.language)
          FROM $auth
          SPLIT language
          GROUP BY language
          FETCH language
          ;
        `,
        snippetSchema.array(),
        z
          .object({
            language: languageSchema,
            count: z.number(),
          })
          .array()
          .transform((languageCounts) => languageCounts.sort((a, b) => b.count - a.count)),
      ),
      getCollections(db),
    ]);

    if (!snippets.ok) {
      throw error(500, snippets.error);
    }
    if (!languageCounts.ok) {
      throw error(500, languageCounts.error);
    }
    if (!collections.ok) {
      throw error(500, collections.error);
    }
    return {
      user,
      snippets: snippets.result,
      languageCounts: languageCounts.result,
      collections: collections.result,
    };
  }
  return { user };
}
