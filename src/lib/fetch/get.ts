import { collectionSchema } from '$lib/schema/collection';
import { snippetSchema } from '$lib/schema/snippet';
import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';
import { appendSearchParameters, parseUrl } from '.';

type GetRoutesShape = Record<
  string,
  {
    params: readonly string[];
    search: readonly string[];
    returns: Record<string, z.ZodTypeAny>;
  }
>;

const getRoutes = {
  '/api/collection': {
    params: [],
    search: [],
    returns: {
      collections: collectionSchema.array(),
    },
  },
  '/api/collection/[collectionId]/snippet': {
    params: ['collectionId'],
    search: [],
    returns: {
      snippets: snippetSchema.array(),
    },
  },
} as const satisfies GetRoutesShape;

type GetRoute = keyof typeof getRoutes;

// Get the z.inferred object return type for a route
type GetWithId<T extends GetRoute> = {
  [Key in keyof (typeof getRoutes)[T]['returns']]: (typeof getRoutes)[T]['returns'][Key] extends z.ZodTypeAny
    ? z.infer<(typeof getRoutes)[T]['returns'][Key]>
    : never;
};
export type Get<T extends RequestEvent<any, GetRoute>> = GetWithId<T['route']['id']>;

export async function parseSearchParameters<T extends RequestEvent<any, GetRoute>>(event: T) {}

export async function get<T extends GetRoute>(
  route: T,
  params: {
    [Key in (typeof getRoutes)[T]['params'][number]]: string;
  },
  search: {
    [Key in (typeof getRoutes)[T]['search'][number]]?: string;
  } = {},
  fetch = window.fetch,
) {
  let url = parseUrl(route, params);
  url = appendSearchParameters(url, search);
  const response = await fetch(url);
  return (await response.json()) as GetWithId<typeof route>;
}

// const data = await get('/api/collection', { dude: '' });
