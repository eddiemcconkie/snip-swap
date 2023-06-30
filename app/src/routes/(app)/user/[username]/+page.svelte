<script lang="ts">
  import { resize } from '$lib/helpers/image.js';

  export let data;
</script>

<h1>{data.selectedUser.name}</h1>
<p>
  <img
    src={resize(data.selectedUser.avatar, 300)}
    alt={data.selectedUser.name}
    width="200"
    height="200"
  />
</p>
{#each data.selectedUser.snippets as snippet}
  <div>
    <pre>{snippet.code}</pre>
    <p>{snippet.description}</p>
    <p>{snippet.language.name}</p>
    <p><a href="/snippet/{snippet.id}">view snippet</a></p>
  </div>
  <br />
{:else}
  <p>{data.selectedUser.name} doesn't have any snippets</p>
{/each}
