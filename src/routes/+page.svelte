<script lang="ts">
  import { resize } from '$lib/helpers/image.js';

  export let data;
</script>

<a href="/signin">Sign in</a>
<a href="/signout">Sign out</a>
{#if data.user}
  {@const displayName = data.user.name ?? data.user.username}
  <p>User: {displayName}</p>
  <img src={resize(data.user.avatar, 300)} alt={displayName} />
{/if}
