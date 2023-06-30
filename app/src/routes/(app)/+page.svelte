<script lang="ts">
  import { page } from '$app/stores';
  import Avatar from '$lib/components/avatar.svelte';
  import Button from '$lib/components/button.svelte';
  import ErrorBanner from '$lib/components/error-banner.svelte';
  import LanguageIcon from '$lib/components/language-icon.svelte';
  import SplitLayout from '$lib/components/layout/split-layout.svelte';
  import Loading from '$lib/components/loading.svelte';
  import Snippet from '$lib/components/snippet.svelte';
  import { setPageAction } from '$lib/context/page-action.js';
  import { space } from '$lib/helpers/css-vars.js';
  import { languages as allLanguages } from '$lib/schema/language.js';
  import { debounceSearch } from '$lib/stores/debounce-search.js';

  export let data;

  let sidebarOpen: boolean;

  setPageAction(() => {
    sidebarOpen = !sidebarOpen;
  });

  const { query, result: searchResults } = debounceSearch($page.url.searchParams.get('q') ?? '');
</script>

<SplitLayout bind:sidebarOpen>
  <svelte:fragment slot="main-header">
    {#if data.queryLanguageData || data.queryUserData || data.search}
      <div class="main-header-content">
        <!-- <div class="flex space-between align-start p-s"> -->
        <div class="truncate ellipsis" style:min-width="0">
          {#if data.queryLanguageData}
            <div class="flex align-end gap-s">
              <div
                class="lh-1 step-5 radius-round border-dark bg-surface-2 flex justify-center align-center p-xs"
              >
                <LanguageIcon language={data.queryLanguageData.id} />
              </div>
              <strong class="step-3 lh-1">{data.queryLanguageData.name}</strong>
            </div>
          {:else if data.queryUserData}
            <div class="flex align-end gap-s">
              <div
                class="radius-round border-dark bg-surface-2 flex justify-center align-center p-3xs"
              >
                <Avatar user={data.queryUserData} size={200} --avatar-size={space('2xl')} />
              </div>
              <div class="flex column lh-1">
                <strong class="step-3">{data.queryUserData.name}</strong>
                <span class="step-0 color-on-surface-faint">@{data.queryUserData.username}</span>
              </div>
            </div>
          {:else if data.search}
            <strong class="step-2">Search: </strong>
            <span class="step-1 truncate">{data.search}</span>
          {/if}
        </div>
        <Button href="/" style="outlined" class="shrink-0">
          <i-heroicons:x-mark-20-solid aria-label="clear search results" />
          <span class="screen:m-l">clear</span>
        </Button>
      </div>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="main">
    <div class="snippet-container | pt-s pb-l flex column gap-s">
      {#each data.snippets as snippet (snippet.id)}
        <div class="mb-l">
          <Snippet {snippet} singleComment latestComment={snippet.latestComment} />
        </div>
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="sidebar">
    <form
      method="get"
      on:submit={() => {
        sidebarOpen = false;
      }}
    >
      <div class="flex align-center bg-surface-3 radius-round pl-2xs mb-s | focus-parent">
        <input
          type="text"
          name="q"
          id="search-query"
          bind:value={$query}
          placeholder="search..."
          autocomplete="off"
        />
        <Button color={$query.length > 0 ? 'accent' : 'surface'} type="submit" aria-label="search">
          <i-heroicons:magnifying-glass-20-solid class="step-1 shrink-0" />
        </Button>
      </div>
      <!-- <Button color="accent" style="solid" type="submit">search</Button> -->
      {#if $searchResults.loading}
        <Loading delay={0} />
      {:else if $searchResults.data}
        {@const { languages, users, snippets } = $searchResults.data}
        {#if languages.length > 0 || $query.length === 0}
          <p class="mb-2xs"><strong>languages</strong></p>
          <ul class="step--1 mb-m flex wrap gap-2xs">
            {#each languages.length > 0 ? languages : allLanguages as language}
              <li>
                <Button
                  color="surface"
                  style="outlined"
                  type="submit"
                  name="language"
                  value={language.id}
                >
                  <LanguageIcon language={language.id} />
                  {language.name}
                </Button>
              </li>
            {/each}
          </ul>
        {/if}
        {#if users.length > 0}
          <p class="mb-2xs"><strong>users</strong></p>
          <ul class="step--1 mb-m flex wrap gap-2xs">
            {#each users as user}
              <li>
                <Button color="surface" style="outlined" type="submit" name="user" value={user.id}>
                  <Avatar {user} --avatar-size={space('m')} />
                  <span class="flex column align-start">
                    <span> {user.name} </span>
                    <span class="step--2 color-on-surface-faint"> @{user.username} </span>
                  </span>
                </Button>
              </li>
            {/each}
          </ul>
        {/if}
        {#if snippets.length > 0}
          <p class="mb-2xs"><strong>snippets</strong></p>
          <ul class="step--1 mb-m">
            {#each snippets as snippet}
              <li>
                {snippet.code}
              </li>
            {/each}
          </ul>
        {/if}
      {:else}
        <ErrorBanner>{$searchResults.error}</ErrorBanner>
      {/if}
    </form>
  </svelte:fragment>

  <i-heroicons:magnifying-glass-20-solid slot="fab-icon" />
</SplitLayout>

<style lang="postcss">
  @import '/src/styles/breakpoints.postcss';

  .main-header-content {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    padding: var(--space-s);
    gap: var(--space-s);
  }

  .snippet-container {
    @media (--medium-screen) {
      margin-inline: auto;
      max-width: 45rem;
      width: calc(100% - var(--space-m));
    }
  }
</style>