import { githubAuth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  if (user) throw redirect(302, '/');

  return { user };
}

export const actions = {
  async github({ cookies, locals, url }) {
    let redirectTo = url.searchParams.get('redirectTo');
    if (!redirectTo?.startsWith('/')) redirectTo = '/';

    // Redirect if already authenticated
    const { session } = await locals.auth.validateUser();
    if (session) throw redirect(302, redirectTo);

    const [authorizationUrl, state] = await githubAuth.getAuthorizationUrl();

    cookies.set('github_oauth_state', state, {
      path: '/',
      maxAge: 60 * 60,
    });

    // Where to redirect to after authorizing
    cookies.set('redirect_to', redirectTo, {
      path: '/',
      maxAge: 60 * 60,
    });

    throw redirect(302, authorizationUrl.toString());
  },
};
