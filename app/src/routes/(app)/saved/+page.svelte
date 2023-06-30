<script lang="ts">
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import { setPageAction } from '$lib/context/page-action.js';

  export let data;

  setPageAction(() => console.log('noice'));
</script>

<h1>saved snippets</h1>

{#if !data.user}
  <SigninPrompt>
    <p>sign in to save snippets!</p>
  </SigninPrompt>
{:else if data.users.ok}
  {#each data.users.result as user}
    <p>{user.name}</p>
  {/each}
{/if}
