<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { space } from '$lib/helpers/css-vars';
  import type { SimpleComment } from '$lib/schema/commented';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { createEventDispatcher } from 'svelte';
  import Avatar from '../avatar.svelte';
  import Button from '../button.svelte';
  import ErrorBanner from '../error-banner.svelte';

  export let snippetId: string;

  const dispatch = createEventDispatcher<{ comment: SimpleComment }>();

  let comment = '';
  let commentError = '';

  let loading = false;

  const handleComment: SubmitFunction = ({ cancel }) => {
    if (comment.trim().length === 0 || !$page.data.user) {
      cancel();
    }
    commentError = '';
    loading = true;

    return async ({ result, update }) => {
      loading = false;
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
          comment = '';
          dispatch('comment', newComment);
        // snippet.commentCount++;
        // newComments = [newComment, ...newComments];
      }
    };
  };
</script>

<div class="flex align-center gap-2xs-xs py-2xs">
  {#if $page.data.user}
    <Avatar user={$page.data.user} --avatar-size={space('m')} />
  {/if}
  <form
    method="post"
    class="snippet-comments__reply | focus-parent | flex gap-2xs step--1 radius-round bg-surface-3 grow"
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
      formaction="/snippet/{snippetId}?/addComment"
      aria-label="post comment"
      {loading}
    >
      <i-heroicons:paper-airplane-20-solid />
    </Button>
  </form>
</div>
{#if commentError}
  <ErrorBanner>{commentError}</ErrorBanner>
{/if}
