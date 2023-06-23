import { connect } from '$lib/db/surreal';
import { getPublicToken, getUserToken } from '$lib/db/surreal.server';
import { auth } from '$lib/server/lucia';
import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  const { session } = await event.locals.auth.validateUser();

  // If there is no session or getting the user token fails, use a public token instead
  const surrealToken =
    (session && (await getUserToken(session.sessionId))) ?? (await getPublicToken())!;
  event.locals.surrealToken = surrealToken;
  event.locals.db = connect(surrealToken);

  return await resolve(event);
};

// Protect non-public API
const handleApi: Handle = async ({ event, resolve }) => {
  if (event.route.id?.startsWith('/api') && !event.route.id.startsWith('/api/public')) {
    const { session } = await event.locals.auth.validateUser();
    if (!session) {
      throw error(401);
    }
  }

  return await resolve(event);
};

export const handle = sequence(handleAuth, handleApi);
