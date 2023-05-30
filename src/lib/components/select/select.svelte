<!-- select.svelte -->
<script lang="ts">
  import { createSelectContext } from './context';

  export let name: string;
  export let id: string;

  const { currentSelected, dialog } = createSelectContext();

  // $: rect = $anchor?.getBoundingClientRect() ?? null;

  function clickBackdrop(node: HTMLElement, callback: () => void) {
    function handleClick(e: MouseEvent) {
      if (e.target === e.currentTarget) {
        callback();
      }
    }
    node.addEventListener('click', handleClick);

    return {
      destroy() {
        node.removeEventListener('click', handleClick);
      },
    };
  }
</script>

<dialog bind:this={$dialog} use:clickBackdrop={() => $dialog?.close()}>
  <ul>
    <slot />
  </ul>
</dialog>

<slot name="trigger" />

{#if $currentSelected}
  <input type="hidden" {name} {id} bind:value={$currentSelected.value} />
{/if}
