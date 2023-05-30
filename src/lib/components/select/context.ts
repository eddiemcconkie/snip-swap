import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

export function createSelectContext() {
  const anchor = writable<HTMLElement | undefined>();
  const currentSelected = writable<{ value: string; label: string } | null>(null);
  const dialog = writable<HTMLDialogElement | undefined>();
  const context = { anchor, currentSelected, dialog };
  setContext('select', context);
  return context;
}

export function getSelectContext() {
  return getContext('select') as ReturnType<typeof createSelectContext>;
}
