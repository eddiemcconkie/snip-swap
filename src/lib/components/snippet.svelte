<script lang="ts">
  import { resize } from '$lib/helpers/image';
  import type { SnippetFetchUserLanguage } from '$lib/schema/snippet';

  export let snippet: SnippetFetchUserLanguage;
</script>

<div class="snippet">
  <div class="header">
    <div class="background | bg-surface-2" />
    <img
      class="avatar | aspect-square ml-xs mb-2xs"
      src={resize(snippet.owner.avatar, 100)}
      alt={snippet.owner.name}
    />
    <div class="bar | flex space-between px-2xs">
      <span class="step--1 my-3xs">{snippet.owner.name}</span>
      <div class="flex align-center gap-2xs">
        <!-- <LanguageIcon language="svelte" /> -->
        <i-heroicons:ellipsis-horizontal-20-solid class="step-1" />
      </div>
    </div>
  </div>
  <pre class="bg-surface-2 step--1 px-xs py-2xs">{snippet.code}</pre>
  <div class="flex space-between bg-surface-1 px-xs">
    <div class="flex gap-xs">
      <div class="flex align-center">
        <i-heroicons:chat-bubble-left />
        <span>&nbsp;{snippet.commentCount}</span>
      </div>
      <div class="flex align-center">
        <i-heroicons:bookmark />
        <span>&nbsp;{snippet.saveCount}</span>
      </div>
    </div>
  </div>
</div>

<style>
  /* .snippet {} */

  .header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
  }
  .header > .background {
    grid-area: 2 / 1 / -1 / -1;
  }
  .header > .avatar {
    grid-area: 1 / 1 / -1 / 2;
    width: var(--space-l);
    border-radius: 100vw;
  }
  .header > .bar {
    grid-area: 2 / 2 / -1 / -1;
  }
</style>
