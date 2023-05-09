import { githubAuth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');
}

export const actions = {
  async github({ cookies, url }) {
    const [authorizationUrl, state] = await githubAuth.getAuthorizationUrl();

    cookies.set('github_oauth_state', state, {
      path: '/',
      maxAge: 60 * 60,
    });

    // Where to redirect to after authorizing
    const redirectTo = url.searchParams.get('redirectTo');
    if (redirectTo?.startsWith('/'))
      cookies.set('redirect_to', redirectTo, {
        path: '/',
        maxAge: 60 * 60,
      });

    throw redirect(302, authorizationUrl.toString());
  },
};
