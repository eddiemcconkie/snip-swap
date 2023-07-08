import { get, type Get } from '$lib/fetch/get';
import type { RequestEvent } from '@sveltejs/kit';
import { derived, writable, type Writable } from 'svelte/store';

type Loadable<T> =
  | {
      loading: true;
    }
  | {
      loading: false;
      data: T;
      error: null;
    }
  | {
      loading: false;
      data: null;
      error: string;
    };

const DEBOUNCE_TIME = 300;

export function debounceSearch(startQuery: string) {
  const query = writable(startQuery);

  let loading = false;
  let timeout: NodeJS.Timeout;

  const result = derived<
    [Writable<string>],
    Loadable<Get<RequestEvent<any, '/api/public/search'>>>
  >(
    [query],
    ([$query], set) => {
      if (loading) {
        clearTimeout(timeout);
      }
      loading = true;
      timeout = setTimeout(() => {
        get('/api/public/search', {}, { q: $query }).then(
          (response) => {
            set({ loading: false, data: response, error: null });
            loading = false;
          },
          (error) => {
            set({ loading: false, data: null, error: `couldn't load search results - ${error}` });
            loading = false;
          },
        );
      }, DEBOUNCE_TIME);
    },
    {
      loading: true,
    },
  );

  return { query, result };
}
