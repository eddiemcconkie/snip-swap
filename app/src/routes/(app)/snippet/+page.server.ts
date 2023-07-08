import { postedSchema, record, snippetSchema } from '@snipswap/schema';
import { surql } from '@snipswap/surreal';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const snippetFormFieldSchema = snippetSchema
  .pick({
    code: true,
    description: true,
    language: true,
    public: true,
  })
  .merge(z.object({ language: record() }));

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  const form = superValidate(snippetFormFieldSchema);

  return { user, form };
}

export const actions = {
  async default({ locals: { auth, db }, request }) {
    const { session } = await auth.validateUser();
    if (!session) throw error(401);

    const form = await superValidate(request, snippetFormFieldSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

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
