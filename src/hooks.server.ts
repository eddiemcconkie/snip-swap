import { getPublicToken, getUserToken } from '$lib/server/db/surreal';
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  const session = await event.locals.auth.validate();

  // If there is no session or getting the user token fails, use a public token instead
  const surrealToken =
    (session && (await getUserToken(session.sessionId))) ?? (await getPublicToken())!;
  event.locals.surrealToken = surrealToken;

  return await resolve(event);
};

export const handle = sequence(handleAuth);
