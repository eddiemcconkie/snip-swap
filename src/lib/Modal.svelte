<script lang="ts" context="module">
  import { writable } from 'svelte/store';

  type ModalConfig = {
    header?: string;
    content: string;
    submitText?: string;
    formaction?: string;
    onSubmit?: () => void;
  };

  const modal = writable<ModalConfig | null>(null);

  export const openModal = (config: ModalConfig) => {
    modal.set(config);
  };
</script>

<script lang="ts">
  let modalEl: HTMLDialogElement;

  $: if ($modal) modalEl?.showModal();
</script>

{#if $modal !== null}
  <dialog
    bind:this={modalEl}
    on:close={() => {
      $modal = null;
    }}
  >
    <form
      method="POST"
      on:submit={() => {
        $modal?.onSubmit?.();
      }}
    >
      <div>
        <p>{$modal.header}</p>
        <button type="submit" formmethod="dialog" aria-label="close modal">
          <i-heroicons:x-mark />
          <!-- <i class="i-heroicons:x-mark" /> -->
        </button>
        <!-- <Button type="submit" formmethod="dialog" aria-label="close modal">
          <i-heroicons:x-mark-solid slot="icon" />
        </Button> -->
      </div>
      <p>{$modal.content}</p>
      <div>
        <button type="submit" formmethod="dialog">cancel</button>
        <button type="submit" formaction={$modal.formaction}>{$modal.submitText ?? 'delete'}</button
        >
      </div>
    </form>
  </dialog>
{/if}
