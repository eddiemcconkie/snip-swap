import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  if (!user) throw redirect(302, '/');

  return { user };
}

export const actions = {
  async default({ locals }) {
    locals.auth.setSession(null);
    throw redirect(302, '/');
  },
};
