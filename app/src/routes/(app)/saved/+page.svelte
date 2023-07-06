<script lang="ts">
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import Button from '$lib/components/button.svelte';
  import LanguageIcon from '$lib/components/language-icon.svelte';
  import ScrollContainer from '$lib/components/layout/scroll-container.svelte';
  import SidebarSection from '$lib/components/layout/sidebar-section.svelte';
  import SplitLayout from '$lib/components/layout/split-layout.svelte';
  import WrapRows from '$lib/components/layout/wrap-rows.svelte';
  import Snippet from '$lib/components/snippet.svelte';
  import { setPageAction } from '$lib/context/page-action.js';

  export let data;

  let sidebarOpen: boolean;

  setPageAction(() => {
    sidebarOpen = !sidebarOpen;
  });
</script>

<SplitLayout bind:sidebarOpen>
  <svelte:fragment slot="main">
    <ScrollContainer class="flex column gap-xl">
      {#if data.user}
        {#each data.snippets as snippet}
          <Snippet
            {snippet}
            on:set-collection={({ detail: collection }) => {
              if (
                collection &&
                data.collections &&
                data.collections.findIndex((c) => c.id === collection?.id) === -1
              ) {
                data.collections = [...data.collections, collection];
              }
            }}
          />
        {/each}
      {:else if data.user}
        <SigninPrompt>
          <p>sign in to save snippets!</p>
        </SigninPrompt>
      {/if}
    </ScrollContainer>
  </svelte:fragment>

  <svelte:fragment slot="sidebar">
    {#if data.user}
      <SidebarSection title="saved languages">
        <form method="get">
          <WrapRows items={data.languageCounts} let:item={{ language, count }}>
            <Button
              color="surface"
              style="outlined"
              type="submit"
              name="language"
              value={language.id}
            >
              <LanguageIcon language={language.id} />
              <span>{language.name}</span>
              <!-- <strong>({count})</strong> -->
              <span class="color-on-surface-faint">{count}</span>
            </Button>
          </WrapRows>
        </form>
      </SidebarSection>
      <SidebarSection title="collections">
        <form method="get">
          <WrapRows items={data.collections} let:item={collection}>
            <Button
              color="accent"
              style="outlined"
              type="submit"
              name="collection"
              value={collection.id}
            >
              {collection.name}
            </Button>
          </WrapRows>
        </form>
      </SidebarSection>
    {/if}
  </svelte:fragment>

  <i-heroicons:folder-open-20-solid slot="fab-icon" />
</SplitLayout>
