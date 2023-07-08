<script lang="ts">
  import { getModalContext } from './context';

  const { modalDialog, resetModal } = getModalContext();
</script>

<dialog
  class="bg-surface-0 color-on-surface border-dark"
  bind:this={$modalDialog}
  on:close={resetModal}
>
  <slot />
</dialog>

<style>
  dialog {
    margin-inline: auto;
    max-inline-size: 35rem;
    inline-size: calc(100% - var(--space-m-l));
    max-block-size: min(90vh, 35rem);

    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  dialog::backdrop {
    background: radial-gradient(farthest-corner at center, rgb(0 0 0 / 0.8), transparent);
    /* background: radial-gradient(farthest-corner at center, rgb(0 0 0 / 0.8), rgb(0 0 0 / 0.3)); */
    /* background: radial-gradient(farthest-corner at center, #111945, rgb(0 0 0 / 0.3)); */
  }
</style>
