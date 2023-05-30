<script lang="ts">
  export let language: string;
</script>

{#if language === 'svelte'}
  (svelte icon)
{:else if language === 'rust'}
  (rust icon)
{:else}
  (plain icon)
{/if}
