<script lang="ts">
  import { page } from '$app/stores';

  const redirectTo = $page.url.searchParams.get('redirectTo');
</script>

<form method="POST">
  <button type="submit" formaction="?/github&redirectTo={redirectTo}"> Sign in with GitHub </button>
</form>
