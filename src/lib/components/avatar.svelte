<script lang="ts">
  import { resize } from '$lib/helpers/image';
  import type { UserSchema } from '$lib/schema/auth';

  export let user: UserSchema;

  export let size = 100;
</script>

<img
  loading="lazy"
  class="aspect-square radius-round"
  src={resize(user.avatar, size)}
  alt={user.name}
/>

<style>
  img {
    width: var(--avatar-size, 1rem);
  }
</style>
