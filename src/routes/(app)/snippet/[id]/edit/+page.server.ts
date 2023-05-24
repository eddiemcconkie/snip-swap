import { redirect } from '@sveltejs/kit';

export async function load({ locals, params }) {
  const { user } = await locals.auth.validateUser();
  if (!user) throw redirect(302, `/snippet/${params.id}`);
  return { user };
}
