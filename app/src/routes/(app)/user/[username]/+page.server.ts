import { getUserWithSnippets } from '$lib/db/snippets.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { auth, db }, params }) {
  const { user } = await auth.validateUser();

  const { user: selectedUser } = await getUserWithSnippets(db, params.username);

  if (!selectedUser.ok) {
    throw error(500, 'something went wrong');
  }
  if (selectedUser.count !== 1) {
    throw redirect(302, '/');
  }

  return { user, selectedUser: selectedUser.result[0] };
}
