<script lang="ts">
  import Button from '../button.svelte';
</script>

<form
  method="dialog"
  class="header | flex space-between align-center bg-surface-1 border-dark-b px-s py-2xs step-1"
>
  <span>
    <slot />
  </span>
  <Button style="ghost" type="submit" aria-label="close modal">
    <i-heroicons:x-mark />
  </Button>
</form>

<style>
  .header {
    display: sticky;
    top: 0;
  }
</style>
