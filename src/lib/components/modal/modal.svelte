<script lang="ts" context="module">
  import { enhance } from '$app/forms';
  import type { ComponentType } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from '../button.svelte';

  type ModalConfig = {
    header?: string;
    content?: string;
    submitText?: string;
    formaction?: string;
    onSubmit?: (submitValue: string | null) => void;

    component?: ComponentType;
    componentProps?: Record<string, any>;
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
    class="bg-surface-0 color-on-surface border-dark"
    bind:this={modalEl}
    on:close={() => {
      $modal = null;
    }}
  >
    <!--
      I would use formmethod="dialog" on the buttons, but use:enhance only works when the method on the form element is "post"...
      Unless this goes through 🤞 https://github.com/sveltejs/kit/issues/10092
    -->
    <form
      method="post"
      use:enhance={() => {
        return () => {};
      }}
      on:submit={(e) => {
        console.log(e.submitter?.getAttribute('value'));
        $modal?.onSubmit?.(e.submitter?.getAttribute('value') ?? null);
        modalEl.close();
      }}
      class="flex column"
    >
      <div class="header | flex space-between align-center bg-surface-0 border-dark-b px-s py-2xs">
        <p class="step-1">{$modal.header ?? ''}</p>
        <Button
          style="ghost"
          type="button"
          aria-label="close modal"
          on:click={() => modalEl.close()}
        >
          <i-heroicons:x-mark />
        </Button>
      </div>
      <div class="p-s">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus soluta excepturi
          voluptates delectus error sequi dolorem architecto quo, accusamus iusto.
        </p>
        <p>
          Vitae dolorum perferendis facere quos, quis soluta aliquid tempora ea reiciendis quia
          explicabo et nihil, id officia, aspernatur dolore accusantium.
        </p>
        <p>
          Quidem non est, impedit quo expedita in ullam enim possimus cum, assumenda, harum quia
          quisquam at a numquam omnis. Quasi?
        </p>
        <p>
          Voluptatum maxime magnam nemo aliquam minima iste, sequi, quo fugit saepe iure molestias
          ut neque odio asperiores nobis velit tempora.
        </p>
        <p>
          Ullam repellendus, quos numquam sunt reiciendis veniam consequuntur, iste exercitationem
          porro deleniti quisquam mollitia sit hic ipsa rem expedita natus!
        </p>
        {#if $modal.content}
          <p>{$modal.content}</p>
        {/if}
        {#if $modal.component}
          <svelte:component this={$modal.component} {...$modal.componentProps} />
        {:else}
          <div>
            <!-- If there is a formaction, there will be submit/cancel buttons -->
            {#if $modal.formaction}
              <button type="button" on:click={() => modalEl.close()}>cancel</button>
              <button type="submit" formaction={$modal.formaction}>
                {$modal.submitText ?? 'submit'}
              </button>
            {:else}
              <!-- Otherwise, it should just be a confirmation modal -->
              <button type="button" on:click={() => modalEl.close()}>ok</button>
            {/if}
          </div>
        {/if}
      </div>
    </form>
  </dialog>
{/if}

<style>
  dialog {
    margin-inline: auto;
    max-inline-size: 35rem;
    inline-size: calc(100% - var(--space-m-l));
    max-block-size: min(90vh, 20rem);
  }

  .header {
    position: sticky;
    top: 0;
  }
</style>
