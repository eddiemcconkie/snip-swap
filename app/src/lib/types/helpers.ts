import type { ComponentType, SvelteComponent } from 'svelte';

export type SvelteProps<T> = T extends ComponentType<SvelteComponent<infer TProps>>
  ? TProps
  : never;
