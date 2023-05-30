<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/button.svelte';
  import Snippet from '$lib/components/snippet.svelte';
  import { setPageAction } from '$lib/context/page-action.js';

  export let data;

  setPageAction(() => {});
</script>

<main class="p-xs">
  {#each data.snippets as snippet (snippet.id)}
    <div>
      <Snippet {snippet} />
      <!-- <img
        src={resize(snippet.owner.avatar, 100)}
        alt={snippet.owner.name}
        width="30"
        height="30"
      />
      <p>created by <a href="/user/{snippet.owner.username}">{snippet.owner.name}</a></p>
      <pre>{snippet.code}</pre>
      <p>{snippet.description}</p>
      <p>{snippet.language.name}</p>
      <p><a href="/snippet/{snippet.id}">view snippet</a></p> -->
      {#if true}
        <!-- {#if !snippet.mine} -->
        <form
          method="POST"
          use:enhance={() => {
            if (!data.user) {
              return;
            }
            data.snippets = data.snippets.map((s) =>
              s.id === snippet.id ? { ...s, saved: !s.saved } : s,
            );
            return async ({ update }) => {
              await update();
            };
            // return async ({ result, update, action }) => {
            //   await update();
            // };
          }}
        >
          {#if snippet.saved}
            <Button
              type="submit"
              color="accent"
              style="solid"
              formaction="/snippet/{snippet.id}?/unsave"
              aria-label="unsave"
            >
              <i-heroicons:bookmark-20-solid slot="icon" />
              <!-- unsave -->
            </Button>
            <!-- <Button
            on:click={(e) => {
              e.preventDefault();
            }}
            color="accent"
            outlined
          >
            <i-heroicons:plus-20-solid slot="icon" />
          </Button> -->
          {:else}
            <Button
              type="submit"
              color="accent"
              style="outlined"
              formaction="/snippet/{snippet.id}?/save"
            >
              <i-heroicons:bookmark-20-solid slot="icon" />
              save
            </Button>
          {/if}
        </form>
      {/if}
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
