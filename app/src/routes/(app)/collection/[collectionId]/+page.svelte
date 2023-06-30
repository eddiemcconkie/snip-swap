<script lang="ts">
  export let data;
</script>

<h1>Collection: {data.collection.name}</h1>
<p>Snippets:</p>
{#each data.snippets as snippet}
  <pre>
    {snippet.code}
  </pre>
{:else}
  <p>This collection doesn't have any snippets yet</p>
{/each}
