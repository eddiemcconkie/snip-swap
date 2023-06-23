import type { ComponentType, SvelteComponentTyped } from 'svelte';

export type SvelteProps<T> = T extends ComponentType<SvelteComponentTyped<infer TProps>>
  ? TProps
  : never;
