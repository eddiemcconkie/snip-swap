<!-- select-trigger.svelte -->
<script>
  import { getSelectContext } from './context';

  export let placeholder = 'select...';

  const { anchor, currentSelected, dialog } = getSelectContext();
</script>

<button
  type="button"
  bind:this={$anchor}
  on:click={() => {
    if ($dialog) {
      $dialog.open ? $dialog.close() : $dialog.showModal();
    }
  }}
>
  {$currentSelected?.label ?? placeholder}
</button>
