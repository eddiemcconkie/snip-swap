<!-- select-trigger.svelte -->
<script>
  import Button from '../button.svelte';
  import { getSelectContext } from './context';

  export let placeholder = 'select...';

  const { anchor, currentSelected, dialog } = getSelectContext();
</script>

<div bind:this={$anchor}>
  <Button
    type="button"
    color="accent"
    style="outlined"
    on:click={() => {
      if ($dialog) {
        $dialog.open ? $dialog.close() : $dialog.showModal();
      }
    }}
  >
    {$currentSelected?.label ?? placeholder}
  </Button>
</div>
