import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, '/');
}

export const actions = {
  async default({ locals }) {
    locals.auth.setSession(null);
    throw redirect(302, '/');
  },
};
