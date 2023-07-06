<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { space } from '$lib/helpers/css-vars';
  import { formatSince } from '$lib/helpers/since';
  import type { CollectionSchema } from '$lib/schema/collection';
  import type { SimpleComment } from '$lib/schema/commented';
  import type { SnippetSchema } from '$lib/schema/snippet';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import Avatar from './avatar.svelte';
  import Button from './button.svelte';
  import ReadonlyCodeBlock from './code/readonly-code-block.svelte';
  import CollectionModal from './collections/collection-modal.svelte';
  import CommentInput from './comments/comment-input.svelte';
  import CommentLoader from './comments/comment-loader.svelte';
  import CommentModal from './comments/comment-modal.svelte';
  import Comment from './comments/comment.svelte';
  import LanguageIcon from './language-icon.svelte';
  import { openModal } from './modal/modal-outlet.svelte';

  export let snippet: SnippetSchema;

  const dispatch = createEventDispatcher<{ 'set-collection': CollectionSchema | null }>();

  const handleSaveUnsave: SubmitFunction = ({ action }) => {
    if (!$page.data.user) {
      return;
    }
    snippet.saved = !snippet.saved;
    snippet.saveCount += snippet.saved ? 1 : -1;

    if (action.searchParams.has('/save')) {
      return async ({ result }) => {
        if (result.type === 'error') {
          console.log(result.error);
          snippet.saved = false;
          snippet.saveCount--;
        }
      };
    }

    if (action.searchParams.has('/unsave')) {
      // Undo if unsaving fails
      return async ({ result }) => {
        if (result.type === 'error') {
          console.log(result.error);
          snippet.saved = true;
          snippet.saveCount++;
        } else if (result.type === 'success') {
          snippet.collection = null;
        }
      };
    }
  };

  export let comments: SimpleComment[] | 'all' = [];

  let newComments: SimpleComment[] = [];
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
    {#if !snippet.mine}
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
                    snippet.collection = value;
                    dispatch('set-collection', value);
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
    {/if}
    {#if snippet.description}
      <p class="snippet-footer__description | step--1 bg-surface-1 px-xs py-2xs border-dark-t">
        {snippet.description}
      </p>
    {/if}
  </div>

  <div class="snippet-comments border-dark-t">
    <CommentInput
      snippetId={snippet.id}
      on:comment={({ detail: newComment }) => {
        snippet.commentCount++;
        newComments = [newComment, ...newComments];
      }}
    />
    {#if comments === 'all'}
      <CommentLoader snippetId={snippet.id} />
    {:else}
      {@const allComments = [...newComments, ...comments]}
      {#each allComments as comment (comment.id)}
        <div in:fade={{ duration: 250 }}>
          <Comment {comment} />
        </div>
      {/each}
      {#if snippet.commentCount > allComments.length}
        <p class="flex justify-center step--1">
          <a
            href="/snippet/{snippet.id}"
            on:click={(e) => {
              if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                openModal(CommentModal, {
                  snippetId: snippet.id,
                  onComment(newComment) {
                    snippet.commentCount++;
                    newComments = [newComment, ...newComments];
                  },
                });
              }
            }}
          >
            see all comments
          </a>
        </p>
      {/if}
    {/if}
  </div>
</div>

<style lang="postcss">
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
  }

  .snippet-header::before,
  .snippet-code-block-link,
  .snippet-footer {
    border-inline: var(--border-dark);
  }
</style>
