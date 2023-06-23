<script context="module" lang="ts">
  import type { ComponentType, SvelteComponentTyped } from 'svelte/internal';
  import { writable } from 'svelte/store';
  import { createModalContext } from './context';

  const modalData = writable<{
    component: ComponentType;
    props: any;
  } | null>(null);

  export function openModal<T extends ComponentType>(
    component: T,
    props: T extends ComponentType<SvelteComponentTyped<infer TProps>> ? TProps : never,
  ) {
    modalData.set({ component, props });
  }

  function resetModal() {
    modalData.set(null);
  }
</script>

<script lang="ts">
  const { modalDialog } = createModalContext(resetModal);

  $: if ($modalData) {
    $modalDialog?.showModal();
  }
</script>

{#if $modalData}
  <svelte:component this={$modalData.component} {...$modalData.props} />
{/if}
