import { getContext, onDestroy } from 'svelte';
import type { Writable } from 'svelte/store';

export const setPageAction = (callback: () => void) => {
  const pageActionStore: Writable<(() => void) | null> = getContext('pageAction');
  pageActionStore.set(callback);

  onDestroy(() => {
    pageActionStore.set(null);
  });
};
