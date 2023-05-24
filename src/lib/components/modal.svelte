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
        <p>{$modal.header ?? ''}</p>
        <button type="submit" formmethod="dialog" aria-label="close modal">
          <i-heroicons:x-mark />
        </button>
      </div>
      <p>{$modal.content}</p>
      <div>
        <!-- If there is a formaction, there will be submit/cancel buttons -->
        {#if $modal.formaction}
          <button type="submit" formmethod="dialog">cancel</button>
          <button type="submit" formaction={$modal.formaction}>
            {$modal.submitText ?? 'submit'}
          </button>
        {:else}
          <!-- Otherwise, it should just be a confirmation modal -->
          <button type="submit" formmethod="dialog">ok</button>
        {/if}
      </div>
    </form>
  </dialog>
{/if}
