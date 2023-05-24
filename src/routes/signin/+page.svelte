<script lang="ts">
  import { page } from '$app/stores';
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';

  const redirectTo = $page.url.searchParams.get('redirectTo');
</script>

<SigninPrompt {redirectTo}>
  <p>sign in to snip swap!</p>
</SigninPrompt>
<!-- <form method="POST">
  <button type="submit" formaction="?/github&redirectTo={redirectTo}"> Sign in with GitHub </button>
</form> -->
