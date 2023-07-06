<script lang="ts">
  import { space } from '$lib/helpers/css-vars';
  import { formatSince } from '$lib/helpers/since';
  import type { CommentSchema } from '$lib/schema/commented';
  import Avatar from '../avatar.svelte';

  export let comment: CommentSchema;
</script>

<div class="flex gap-s mt-2xs">
  <div class="shrink-0">
    <Avatar user={comment.owner} --avatar-size={space('m')} />
  </div>
  <div>
    <div class="lh-1">
      <strong class="step--1">{comment.owner.name}</strong>
      <em class="step--2 color-on-surface-faint">
        {formatSince(comment.time.since)}
      </em>
    </div>
    <p class="step--1 pt-3xsss">{comment.comment}</p>
  </div>
</div>
