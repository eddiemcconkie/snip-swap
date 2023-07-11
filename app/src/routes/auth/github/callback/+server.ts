import { parseSearchParameters } from '$lib/fetch/search.js';
import { auth, githubAuth } from '$lib/server/lucia.js';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ cookies, url, locals }) {
  const { code, state } = parseSearchParameters(url, ['code', 'state']);

  const storedState = cookies.get('github_oauth_state');

  if (state !== storedState) throw error(401, 'Invalid authentication');

  try {
    const { existingUser, providerUser, createUser } = await githubAuth.validateCallback(
      code ?? '',
    );

    const getUser = async () => {
      if (existingUser) return existingUser;
      return await createUser({
        username: providerUser.login,
        name: providerUser.name ?? providerUser.login,
        avatar: providerUser.avatar_url,
      });
    };
    const user = await getUser();
    const session = await auth.createSession(user.id);
    locals.auth.setSession(session);
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
    });
  }

  const redirectTo = cookies.get('redirect_to') ?? '/';
  cookies.delete('redirect_to');

  throw redirect(302, redirectTo?.startsWith('/') ? redirectTo : '/');
}
