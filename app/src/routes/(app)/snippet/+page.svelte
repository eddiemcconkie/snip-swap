<script lang="ts">
  import { enhance } from '$app/forms';
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import Button from '$lib/components/button.svelte';
  import EditableCodeBlock from '$lib/components/code/editable-code-block.svelte';
  import LanguageIcon from '$lib/components/language-icon.svelte';
  import ScrollContainer from '$lib/components/layout/scroll-container.svelte';
  import { Select, type Selected } from '$lib/components/select/index.js';
  import { languages } from '@snipswap/schema';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form } = superForm(data.form);

  let lastUsedLanguage = 'svelte';
  $: selectedLanguage = $form.language || lastUsedLanguage;

  function onSelectLanguage(event: { detail: Selected }) {
    selectedLanguage = event.detail?.value ?? '';
  }

  let loading = false;
</script>

<!-- <div class="step--2">
  <SuperDebug data={$form} />
</div> -->

<ScrollContainer>
  {#if !data.user}
    <SigninPrompt>
      <p>sign in to create snippets!</p>
    </SigninPrompt>
  {:else}
    <form
      method="post"
      class="flow"
      use:enhance={() => {
        loading = true;

        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
    >
      <div class="flex align-center gap-m">
        <div class="flex align-center gap-2xs">
          <label for="language">language</label>
          <Select name="language" id="language" on:select={onSelectLanguage}>
            <Select.Divider>recently used</Select.Divider>
            <Select.Divider>languages</Select.Divider>
            {#each languages as language}
              <Select.Option
                label={language.name}
                value={language.id}
                selected={language.id === selectedLanguage}
              >
                <LanguageIcon language={language.id} slot="icon" />
              </Select.Option>
            {/each}
            <svelte:fragment slot="trigger">
              <Select.Trigger let:selected>
                <LanguageIcon language={selected?.value ?? ''} />
                <span>{selected?.label}</span>
              </Select.Trigger>
            </svelte:fragment>
          </Select>
        </div>
        <div>
          <label for="public">public</label>
          <input type="checkbox" name="public" id="public" bind:checked={$form.public} />
        </div>
      </div>
      <div>
        <label for="code">write some code</label>
        <EditableCodeBlock bind:language={selectedLanguage} startWith={$form.code} />
      </div>
      <div>
        <label for="description">add a description</label>
        <textarea name="description" id="description" bind:value={$form.description} />
      </div>

      <Button color="accent" style="solid" type="submit" {loading}>post snippet!</Button>
    </form>
  {/if}
</ScrollContainer>
