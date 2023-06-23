import { getSnippets } from '$lib/db/snippets.js';

export async function load({ locals: { auth, db } }) {
  const { user } = await auth.validateUser();

  const { snippets } = await getSnippets(db);

  return { user, snippets: snippets.ok ? snippets.result : [] };
}
