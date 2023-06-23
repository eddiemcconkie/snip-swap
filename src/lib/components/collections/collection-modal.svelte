<script lang="ts">
  import { enhance } from '$app/forms';
  import {
    Modal,
    ModalCancelButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
  } from '$lib/components/custom-modal';
  import { get } from '$lib/fetch/get';
  import type { CollectionSchema } from '$lib/schema/collection';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import Button from '../button.svelte';
  import { getModalContext } from '../custom-modal/context';
  import Loading from '../loading.svelte';

  export let snippetId: string;

  export let currentCollection: CollectionSchema | null;
  $: console.log(currentCollection);

  export let onSubmit = (value: string | null) => {};

  const { modalDialog } = getModalContext();

  const collectionsResponse = get('/api/collection', {});

  let collectionNames: string[] = [];
  collectionsResponse.then(({ collections }) => {
    collectionNames = collections.map((collection) => collection.name);
  });

  let newCollectionName = currentCollection?.name ?? '';
  let errorMessage = '';

  let isCreateButtonLoading = false;
  let isRemoveButtonLoading = false;

  function sorted(
    collections: Awaited<typeof collectionsResponse>['collections'],
    current: string,
  ) {
    return collections.sort((a, b) => {
      if (a.name === current) return -1;
      if (b.name === current) return 1;
      if (current.length > 0 && a.name.startsWith(current)) return -1;
      if (current.length > 0 && b.name.startsWith(current)) return 1;
      return a.name > b.name ? 1 : -1;
    });
  }

  const handleSubmit: SubmitFunction = ({ action }) => {
    errorMessage = '';
    if (
      action.searchParams.has('/addToNewCollection') ||
      action.searchParams.has('/addToCollection')
    ) {
      isCreateButtonLoading = true;

      return ({ result }) => {
        isCreateButtonLoading = false;

        switch (result.type) {
          case 'failure':
            errorMessage = result.data?.error ?? 'failure';
            return;
          case 'error':
            errorMessage = result.error;
            return;
          case 'success':
            onSubmit(result.data?.name);
            $modalDialog.close();
        }
      };
    } else if (action.searchParams.has('/removeCollection')) {
      isRemoveButtonLoading = true;

      return ({ result }) => {
        isRemoveButtonLoading = false;

        switch (result.type) {
          case 'failure':
            errorMessage = result.data?.error ?? 'failure';
            return;
          case 'error':
            errorMessage = result.error;
            return;
          case 'success':
            onSubmit(null);
            $modalDialog.close();
        }
      };
    }
  };
</script>

<Modal>
  <form method="post" use:enhance={handleSubmit}>
    <ModalHeader>
      {#if currentCollection}
        switch collections
      {:else}
        add snippet to a collection
      {/if}
    </ModalHeader>
    <ModalContent>
      {#await collectionsResponse}
        <Loading delay={200} />
      {:then { collections }}
        <label for="new-collection-name" class="step--1">create a new collection</label>
        <p>{errorMessage}</p>
        <div class="flex gap-2xs">
          <input
            type="text"
            name="name"
            id="new-collection-name"
            min="1"
            max="30"
            bind:value={newCollectionName}
            autocomplete="off"
            autofocus
            class="grow-shrink"
          />
          <Button
            color="accent"
            style="solid"
            type="submit"
            class="shrink-0"
            formaction="/snippet/{snippetId}?/addToNewCollection"
            bind:loading={isCreateButtonLoading}
          >
            {#if collectionNames.includes(newCollectionName)}
              add
            {:else}
              create
            {/if}
          </Button>
        </div>
        <p class="step--2" style:color={newCollectionName.length > 30 ? 'var(--on-error)' : null}>
          {newCollectionName.length}/30
        </p>
        <h2>existing collections</h2>

        <ul class="flex wrap gap-2xs">
          {#each sorted(collections, newCollectionName) as collection (collection.id)}
            <li in:slide animate:flip={{ duration: 200 }}>
              <Button
                color="accent"
                style={collection.name === newCollectionName ? 'solid' : 'outlined'}
                formaction="/snippet/{snippetId}?/addToCollection&collectionId={collection.id}"
              >
                {collection.name}
              </Button>
            </li>
          {:else}
            <li class="step--1">you don't have any collections yet</li>
          {/each}
        </ul>
      {:catch error}
        <p>{error}</p>
      {/await}
    </ModalContent>
    <ModalFooter>
      {#if currentCollection}
        <Button type="submit" formaction="/snippet/{snippetId}?/removeCollection">
          <i-heroicons:arrow-uturn-left-20-solid /> no collection
        </Button>
      {:else}
        <ModalCancelButton />
      {/if}
    </ModalFooter>
    <!-- <ModalFooter>
      <ModalCancelButton />
      <ModalSubmitButton />
    </ModalFooter> -->
  </form>
</Modal>
