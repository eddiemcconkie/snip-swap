<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { get } from '$lib/fetch/get';
  import { space } from '$lib/helpers/css-vars';
  import { formatSince } from '$lib/helpers/since';
  import type { SimpleComment } from '$lib/schema/commented';
  import type { SnippetSchema } from '$lib/schema/snippet';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { fade, slide } from 'svelte/transition';
  import Avatar from './avatar.svelte';
  import Button from './button.svelte';
  import ReadonlyCodeBlock from './code/readonly-code-block.svelte';
  import CollectionModal from './collections/collection-modal.svelte';
  import Comment from './comment.svelte';
  import ErrorBanner from './error-banner.svelte';
  import LanguageIcon from './language-icon.svelte';
  import Loading from './loading.svelte';
  import { openModal } from './modal/modal-outlet.svelte';

  export let snippet: SnippetSchema;

  let comment = '';

  const handleSaveUnsave: SubmitFunction = ({ action }) => {
    if (!$page.data.user) {
      return;
    }
    snippet.saved = !snippet.saved;
    snippet.saveCount += snippet.saved ? 1 : -1;

    if (action.searchParams.has('/unsave')) {
      // Undo if unsaving fails
      return async ({ result }) => {
        if (result.type === 'error') {
          console.log(result.error);
          snippet.saved = true;
          snippet.saveCount++;
        }
      };
    }
  };

  export let singleComment = false;
  export let latestComment: SimpleComment | null = null;
  let commentError = '';

  let commentsPromise = singleComment
    ? null
    : get('/api/public/snippet/[snippetId]/comments', { snippetId: snippet.id });

  const handleComment: SubmitFunction = ({ cancel }) => {
    if (comment.trim().length === 0 || !$page.data.user) {
      cancel();
    }
    commentError = '';

    // const oldHighlighted = snippet.highlightedComment

    return async ({ result, update }) => {
      switch (result.type) {
        case 'error':
        case 'redirect':
          await update();
          return;

        case 'failure':
          commentError = result.data?.error;
          return;

        case 'success':
          const newComment: SimpleComment = result.data!.comment;
          latestComment = newComment;
          comment = '';
          snippet.commentCount++;
      }
    };
  };
</script>

<div class="snippet">
  <!-- Header -->
  <div class="snippet-header | border-light-b">
    <div class="snippet-header__avatar | ml-xs mb-2xs">
      <Avatar user={snippet.owner} --avatar-size={space('l')} />
    </div>
    <div class="snippet-header__info | flex space-between px-2xs">
      <div class="flex gap-3xs align-center my-3xs">
        <strong class="step--1">{snippet.owner.name}</strong>
        <em class="step--2 color-on-surface-faint">{formatSince(snippet.time.since)}</em>
      </div>
      <div class="flex align-center gap-2xs step--1">
        <LanguageIcon language={snippet.language.id} />
        <i-heroicons:ellipsis-horizontal-20-solid class="step-1" />
        <!-- <Button>
          <i-heroicons:ellipsis-horizontal-20-solid class="step-1" />
        </Button> -->
      </div>
    </div>
  </div>

  <!-- Code block -->
  <a href="/snippet/{snippet.id}" class="snippet-code-block-link">
    <ReadonlyCodeBlock code={snippet.code} language={snippet.language.id} />
  </a>

  <!-- Action bar -->
  <!-- <div class="flex space-between bg-surface-1 px-xs"> -->
  <div class="snippet-footer">
    <div class="snippet-footer__stats | flex gap-xs step--1 ml-xs my-3xs">
      <div class="flex align-center">
        <!-- <i-heroicons:chat-bubble-left /> -->
        <i-heroicons:chat-bubble-left-20-solid />
        <span>&nbsp;{snippet.commentCount}</span>
      </div>
      <div class="flex align-center">
        <!-- <i-heroicons:bookmark /> -->
        <i-heroicons:bookmark-20-solid />
        <span>&nbsp;{snippet.saveCount}</span>
      </div>
    </div>
    <div class="snippet-footer__actions | flex wrap justify-end gap-xs pr-xs py-2xs">
      <form method="post" use:enhance={handleSaveUnsave}>
        <Button
          type="submit"
          color="accent"
          style={snippet.saved ? 'solid' : 'outlined'}
          formaction="/snippet/{snippet.id}?/{snippet.saved ? 'unsave' : 'save'}"
        >
          <i-heroicons:bookmark-20-solid />
          {#if !snippet.saved}
            <span transition:slide={{ axis: 'x', duration: 100 }}>save</span>
          {/if}
        </Button>
      </form>
      {#if snippet.saved}
        <div transition:slide={{ axis: 'x', duration: 100 }}>
          <Button
            type="button"
            color="accent"
            class="truncate"
            style={snippet.collection ? 'solid' : 'outlined'}
            on:click={() => {
              openModal(CollectionModal, {
                snippetId: snippet.id,
                currentCollection: snippet.collection,
                onSubmit(value) {
                  if (value) {
                    snippet.collection = { name: value, id: '', owner: '' };
                  } else {
                    snippet.collection = null;
                  }
                },
              });
            }}
          >
            {#if snippet.collection}
              {snippet.collection.name}
            {:else}
              <i-heroicons:plus-20-solid />
              collection
            {/if}
          </Button>
        </div>
      {/if}
    </div>
    {#if snippet.description}
      <p class="snippet-footer__description | step--1 bg-surface-1 px-xs py-2xs border-dark-t">
        {snippet.description}
      </p>
    {/if}
  </div>

  <div class="snippet-comments border-dark-t">
    <div class="flex align-center gap-2xs-xs py-2xs">
      {#if $page.data.user}
        <Avatar user={$page.data.user} --avatar-size={space('m')} />
      {:else}{/if}
      <form
        method="post"
        class="snippet-comments__reply | flex gap-2xs step--1 radius-round bg-surface-3 grow"
        use:enhance={handleComment}
      >
        <input
          type="text"
          name="comment"
          bind:value={comment}
          min="1"
          aria-label="write comment"
          placeholder="reply..."
          autocomplete="off"
        />
        <Button
          style="solid"
          color={comment.trim().length > 0 ? 'accent' : 'surface'}
          type="submit"
          formaction="/snippet/{snippet.id}?/addComment"
          aria-label="post comment"
        >
          <i-heroicons:paper-airplane-20-solid />
        </Button>
      </form>
    </div>
    {#if commentError}
      <ErrorBanner>{commentError}</ErrorBanner>
    {/if}
    {#if singleComment && latestComment}
      {#key latestComment}
        <div in:fade={{ duration: 250 }}>
          <Comment comment={latestComment} />
        </div>
      {/key}
      {#if snippet.commentCount > 1}
        <p class="flex justify-center step--1">
          <a href="/snippet/{snippet.id}">see more comments</a>
        </p>
      {/if}
    {:else if !singleComment && commentsPromise}
      {#await commentsPromise}
        <Loading delay={200} />
      {:then { comments }}
        <ul>
          {#each comments as comment}
            <Comment {comment} />
            <!-- {:else} -->
            <!-- <span class="step--1">no comments yet</span> -->
          {/each}
        </ul>
      {:catch error}
        <ErrorBanner>
          {#if error}
            error
          {:else}
            could not load comments
          {/if}
        </ErrorBanner>
      {/await}
    {/if}
  </div>
</div>

<style lang="postcss">
  @import '/src/styles/breakpoints.postcss';

  .snippet-header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
  }
  .snippet-header::before {
    content: '';
    grid-area: 2 / 1 / -1 / -1;
    background-color: var(--surface-2);
  }
  .snippet-header__avatar {
    grid-area: 1 / 1 / -1 / 2;
    /* width: var(--space-l); */
  }
  .snippet-header__info {
    grid-area: 2 / 2 / -1 / -1;
  }

  .snippet-code-block-link {
    display: block;
    text-decoration: none;
    color: unset;
  }

  .snippet-footer {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    column-gap: var(--space-xs);
  }
  .snippet-footer::before {
    content: '';
    grid-area: 1 / 1 / 2 / -1;
    background-color: var(--surface-2);
  }
  .snippet-footer::after {
    content: '';
    grid-area: 2 / 1 / -1 / -1;
    background-color: var(--surface-1);
    z-index: -1;
    border-block-start: var(--border-dark);
  }
  .snippet-footer__stats {
    grid-area: 2 / 1 / -1 / 2;
  }
  .snippet-footer__actions {
    grid-area: 1 / 2 / -1 / -1;
    min-width: 0;
  }
  .snippet-footer__description,
  .snippet-comments {
    grid-column: 1 / -1;
  }

  .snippet-comments {
    padding-inline: var(--space-2xs);

    /* @media (--medium-screen) {
      padding-inline: 0;
    } */
  }

  .snippet-header::before,
  .snippet-code-block-link,
  .snippet-footer {
    border-inline: var(--border-dark);
  }
</style>
