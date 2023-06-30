<script lang="ts">
  import Button from '../button.svelte';
</script>

<Button type="submit" formmethod="dialog">
  <slot>cancel</slot>
</Button>
