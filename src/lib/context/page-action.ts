import { getContext, onDestroy, setContext } from 'svelte';
import { writable } from 'svelte/store';

export function createPageActionContext() {
  const pageAction = writable<(() => void) | null>(null);
  setContext('pageAction', pageAction);
  return pageAction;
}

export function setPageAction(callback: () => void) {
  const pageActionStore: ReturnType<typeof createPageActionContext> = getContext('pageAction');
  pageActionStore.set(callback);

  onDestroy(() => {
    pageActionStore.set(null);
  });
}
