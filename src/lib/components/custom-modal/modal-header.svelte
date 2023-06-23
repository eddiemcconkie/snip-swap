<script lang="ts">
  import Button from '../button.svelte';
  import { getModalContext } from './context';

  const { modalDialog } = getModalContext();
</script>

<div class="header | flex space-between align-center bg-surface-1 border-dark-b px-s py-2xs step-1">
  <span>
    <slot />
  </span>
  <Button
    style="ghost"
    type="button"
    aria-label="close modal"
    on:click={() => $modalDialog.close()}
  >
    <i-heroicons:x-mark />
  </Button>
</div>

<style>
  .header {
    display: sticky;
    top: 0;
  }
</style>
