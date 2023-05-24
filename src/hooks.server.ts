import { getPublicToken, getUserToken } from '$lib/db/surreal.server';
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
  console.log(event.url.pathname + event.url.search);
  event.locals.auth = auth.handleRequest(event);
  const session = await event.locals.auth.validate();

  // If there is no session or getting the user token fails, use a public token instead
  const surrealToken =
    (session && (await getUserToken(session.sessionId))) ?? (await getPublicToken())!;
  event.locals.surrealToken = surrealToken;

  console.log(event.locals.surrealToken);

  return await resolve(event);
};

export const handle = sequence(handleAuth);
