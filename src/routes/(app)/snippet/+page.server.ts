import { connect, surql } from '$lib/db/surreal.js';
import { languageSchema } from '$lib/schema/language.js';
import { postedSchema } from '$lib/schema/posted.js';
import { snippetSchema } from '$lib/schema/snippet.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const snippetFormFieldSchema = snippetSchema.omit({ id: true, owner: true, time: true });

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  const form = superValidate(snippetFormFieldSchema);

  const db = connect(locals.surrealToken);
  const [languages] = await db.query(surql`SELECT * FROM language`, languageSchema.array());

  return { user, form, languages: languages.ok ? languages.result : [] };
}

export const actions = {
  async default({ locals, request }) {
    const { session } = await locals.auth.validateUser();
    if (!session) throw error(401);

    const form = await superValidate(request, snippetFormFieldSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);

    const db = connect(locals.surrealToken);
    const [newSnippet, posted] = await db.query(
      surql`
        BEGIN;
        LET $newSnippet = (CREATE snippet SET
          code = type::string(${form.data.code}),
          description = type::string(${form.data.description}),
          language = type::thing("language", ${form.data.language}),
          public = type::bool(${form.data.public})
        );
        RELATE $auth->posted->$newSnippet;
        COMMIT;
      `,
      z.null(),
      postedSchema.array(),
    );
    if (!newSnippet.ok || !posted.ok) return fail(500, { form });

    throw redirect(302, '/');
  },
};
