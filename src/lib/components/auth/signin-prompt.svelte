<script lang="ts">
  import { page } from '$app/stores';

  export let redirectTo: string | null = null;
</script>

<form method="POST">
  <slot />
  <button type="submit" formaction="/signin?/github&redirectTo={redirectTo ?? $page.url.pathname}">
    sign in with GitHub
  </button>
</form>
