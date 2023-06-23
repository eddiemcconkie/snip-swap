import { collectionSchema } from '$lib/schema/collection';
import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';
import { parseUrl } from '.';

type PostRoutesShape = Record<
  string,
  {
    params: readonly string[];
    body: z.ZodTypeAny;
    returns: Record<string, z.ZodTypeAny>;
  }
>;

const postRoutes = {
  '/api/collection': {
    params: [],
    body: collectionSchema.pick({ name: true }),
    returns: {
      collection: collectionSchema,
    },
  },
} as const satisfies PostRoutesShape;

type PostRoute = keyof typeof postRoutes;

// Get the z.inferred object return type for a route
type PostWithId<T extends PostRoute> = {
  [Key in keyof (typeof postRoutes)[T]['returns']]: (typeof postRoutes)[T]['returns'][Key] extends z.ZodTypeAny
    ? z.infer<(typeof postRoutes)[T]['returns'][Key]>
    : never;
};
export type Post<T extends RequestEvent<any, PostRoute>> = PostWithId<T['route']['id']>;

export async function parseBody<T extends RequestEvent<any, PostRoute>>(event: T) {
  const { body } = postRoutes[event.route.id];
  return body.parse(await event.request.json());
}

export async function post<T extends PostRoute>(
  route: T,
  params: {
    [Key in (typeof postRoutes)[T]['params'][number]]: string;
  },
  body: z.infer<(typeof postRoutes)[T]['body']>,
  fetch = window.fetch,
) {
  const url = parseUrl(route, params);
  const response = await fetch(url, { method: 'post', body: JSON.stringify(body) });
  return (await response.json()) as PostWithId<typeof route>;
}
