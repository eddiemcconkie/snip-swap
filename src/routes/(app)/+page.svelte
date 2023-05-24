<script lang="ts">
  import { resize } from '$lib/helpers/image.js';
  import { setPageAction } from './pageAction.js';

  export let data;

  let count = 0;
  setPageAction(() => {
    count++;
  });
</script>

<main class="px-xs">
  <h1>home {count}</h1>

  {#each data.snippets as snippet}
    <div>
      <img
        src={resize(snippet.owner.avatar, 100)}
        alt={snippet.owner.name}
        width="30"
        height="30"
      />
      <p>created by <a href="/user/{snippet.owner.username}">{snippet.owner.name}</a></p>
      <pre>{snippet.code}</pre>
      <p>{snippet.description}</p>
      <p>{snippet.language.name}</p>
      <p><a href="/snippet/{snippet.id}">view snippet</a></p>
    </div>
    <br />
  {/each}

  <!-- <button
    on:click={() =>
      openModal({
        content: 'hey',
      })}
  >
    Show modal
  </button> -->
</main>
