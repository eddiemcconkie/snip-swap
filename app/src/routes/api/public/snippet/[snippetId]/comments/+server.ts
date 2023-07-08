import { getSnippetComments } from '$lib/data/snippets';
import type { Get } from '$lib/fetch/get.js';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
  const { comments } = await getSnippetComments(event.locals.db, event.params.snippetId);

  if (!comments.ok) {
    throw error(500, comments.error);
  }

  return json({
    comments: comments.result,
  } satisfies Get<typeof event>);
}
