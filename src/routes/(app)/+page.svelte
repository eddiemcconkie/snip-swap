<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/button.svelte';
  import SplitLayout from '$lib/components/layout/split-layout.svelte';
  import Snippet from '$lib/components/snippet.svelte';
  import { setPageAction } from '$lib/context/page-action.js';

  export let data;

  let sidebarOpen: boolean;

  setPageAction(() => {
    sidebarOpen = !sidebarOpen;
  });

  let query = $page.url.searchParams.get('q') ?? '';
</script>

<SplitLayout bind:sidebarOpen>
  <svelte:fragment slot="main">
    <div class="snippet-container | pt-s pb-l flex column gap-s">
      {#each data.snippets as snippet (snippet.id)}
        <Snippet {snippet} latestComment={snippet.latestComment} />
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="sidebar">
    <form method="get">
      <!-- <div class="flex align-center justify-end wrap gap-2xs-xs"> -->
      <div class="flex align-center justify-end gap-2xs-xs">
        <div
          class="searchbar-input | flex align-center bg-surface-3 radius-round pl-2xs | focus-parent"
        >
          <i-heroicons:magnifying-glass-20-solid class="step-1 shrink-0" />
          <input type="text" name="q" id="search-query" bind:value={query} />
        </div>
        <Button color="accent" style="solid" type="submit">search</Button>
      </div>
    </form>
  </svelte:fragment>

  <i-heroicons:magnifying-glass-20-solid slot="fab-icon" />
</SplitLayout>

<style lang="postcss">
  @import '/src/styles/breakpoints.postcss';

  .snippet-container {
    @media (--medium-screen) {
      margin-inline: auto;
      max-width: 45rem;
      width: calc(100% - var(--space-m));
    }
  }

  /* .searchbar-input {
    flex: 1 1 10rem;
  } */
</style>
