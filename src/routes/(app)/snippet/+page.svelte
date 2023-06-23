<script lang="ts">
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import EditableCodeBlock from '$lib/components/code/editable-code-block.svelte';
  import LanguageIcon from '$lib/components/language-icon.svelte';
  import {
    Select,
    SelectDivider,
    SelectOption,
    SelectTrigger,
    type Selected,
  } from '$lib/components/select';
  import { languages } from '$lib/schema/language.js';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form } = superForm(data.form);

  let lastUsedLanguage = 'svelte';
  $: selectedLanguage = $form.language || lastUsedLanguage;

  function onSelectLanguage(event: { detail: Selected }) {
    selectedLanguage = event.detail?.value ?? '';
  }
</script>

<!-- <div class="step--2">
  <SuperDebug data={$form} />
</div> -->

<h1>new snippet</h1>

{#if !data.user}
  <SigninPrompt>
    <p>sign in to create snippets!</p>
  </SigninPrompt>
{:else}
  <form method="POST">
    <div>
      <label for="code">write some code</label>
      <!-- <textarea name="code" id="code" bind:value={$form.code} /> -->
      <EditableCodeBlock bind:language={selectedLanguage} startWith={$form.code} />
    </div>
    <div>
      <label for="description">add a description</label>
      <textarea name="description" id="description" bind:value={$form.description} />
    </div>
    <div>
      <label for="language">language</label>
      <Select name="language" id="language" on:select={onSelectLanguage}>
        <SelectDivider>recently used</SelectDivider>
        <SelectDivider>languages</SelectDivider>
        {#each languages as language}
          <SelectOption
            label={language.name}
            value={language.id}
            selected={language.id === selectedLanguage}
          >
            <LanguageIcon language={language.id} slot="icon" />
          </SelectOption>
        {/each}
        <SelectTrigger slot="trigger" />
      </Select>
    </div>
    <div>
      <label for="public">public</label>
      <input type="checkbox" name="public" id="public" bind:checked={$form.public} />
    </div>
    <button type="submit">done!</button>
  </form>
{/if}
