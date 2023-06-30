<script lang="ts">
  import Button from '../button.svelte';
</script>

<div class="header | flex space-between align-center bg-surface-1 border-dark-b px-s py-2xs step-1">
  <span>
    <slot />
  </span>
  <Button style="ghost" type="submit" aria-label="close modal" formmethod="dialog">
    <i-heroicons:x-mark />
  </Button>
</div>

<style>
  .header {
    display: sticky;
    top: 0;
  }
</style>
