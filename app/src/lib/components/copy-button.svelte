<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from './button.svelte';

  export let value: string;

  let waiting = false;
</script>

<Button
  on:click={() => {
    if (waiting) {
      return;
    }

    navigator.clipboard.writeText(value);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, 3000);
  }}
>
  {#if waiting}
    <span in:slide={{ duration: 100, axis: 'x' }}>copied!</span>
    <i-heroicons:clipboard-document-check-20-solid />
  {:else}
    <i-heroicons:clipboard-document-20-solid />
  {/if}
</Button>
