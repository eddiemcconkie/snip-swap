import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

export function createModalContext(resetModal: () => void) {
  const modalDialog = writable<HTMLDialogElement>();
  setContext('modal', { modalDialog, resetModal });
  return { modalDialog, resetModal };
}

export function getModalContext(): ReturnType<typeof createModalContext> {
  return getContext('modal');
}
