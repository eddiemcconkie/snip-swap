<!-- select-option.svelte -->
<script lang="ts">
  import { getSelectContext } from './context';

  export let value: string;
  export let label: string;
  export let selected = false;
  const { currentSelected, dialog } = getSelectContext();

  function select() {
    $currentSelected = {
      value,
      label,
    };
  }

  if (selected) {
    select();
  }
</script>

<li>
  <button
    type="button"
    on:click={() => {
      select();
      $dialog?.close();
    }}
  >
    <slot name="icon" />
    {label}
  </button>
</li>
