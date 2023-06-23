<script lang="ts">
  export let snippetId: string;

  let collections = [
    { id: 1, name: 'collection 1' },
    { id: 2, name: 'collection 2' },
    { id: 3, name: 'collection 3' },
  ];
</script>

{#each collections as collection}
  <button
    type="submit"
    formaction="/snippet/{snippetId}?/addToCollection&collectionId={collection.id}"
    value={collection.name}
  >
    add to {collection.name}
  </button>
{/each}
