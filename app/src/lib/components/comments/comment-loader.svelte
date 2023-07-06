<script lang="ts">
  import { browser } from '$app/environment';
  import { get } from '$lib/fetch/get';
  import type { SimpleComment } from '$lib/schema/commented';
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import ErrorBanner from '../error-banner.svelte';
  import Loading from '../loading.svelte';
  import Comment from './comment.svelte';

  export let snippetId: string;

  export let newComments: SimpleComment[] = [];

  $: commentsPromise = browser
    ? get('/api/public/snippet/[snippetId]/comments', { snippetId: snippetId })
    : null;
</script>

{#if commentsPromise}
  {#await commentsPromise}
    <Loading delay={200} />
  {:then { comments }}
    <ul>
      {#each [...newComments, ...comments] as comment (comment.id)}
        <li in:slide|global={{ duration: 150 }} animate:flip={{ duration: 150 }}>
          <Comment {comment} />
        </li>
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
