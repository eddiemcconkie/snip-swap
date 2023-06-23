<script lang="ts">
  import Button from '../button.svelte';
  import { getModalContext } from './context';

  const { modalDialog } = getModalContext();
</script>

<Button type="button" on:click={() => $modalDialog.close()}>
  <slot>cancel</slot>
</Button>
