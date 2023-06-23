import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Selected } from '.';

export function createSelectContext() {
  const anchor = writable<HTMLElement | undefined>();
  const currentSelected = writable<Selected>(null);
  const dialog = writable<HTMLDialogElement | undefined>();
  const context = { anchor, currentSelected, dialog };
  setContext('select', context);
  return context;
}

export function getSelectContext(): ReturnType<typeof createSelectContext> {
  return getContext('select');
}
