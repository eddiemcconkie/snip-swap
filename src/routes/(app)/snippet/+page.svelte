<script lang="ts">
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import LanguageIcon from '$lib/components/language-icon.svelte';
  import { Select, SelectOption, SelectTrigger } from '$lib/components/select';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const { form } = superForm(data.form);

  let lastUsedLanguage = 'svelte';
</script>

<div class="step--2">
  <SuperDebug data={$form} />
</div>

<h1>new snippet</h1>

{#if !data.user}
  <SigninPrompt>
    <p>sign in to create snippets!</p>
  </SigninPrompt>
{:else}
  <form method="POST">
    <div>
      <label for="code">write some code</label>
      <textarea name="code" id="code" bind:value={$form.code} />
    </div>
    <div>
      <label for="description">add a description</label>
      <textarea name="description" id="description" bind:value={$form.description} />
    </div>
    <div>
      <label for="langauge">language</label>
      <Select name="language" id="language">
        {#each data.languages as language}
          <SelectOption
            label={language.name}
            value={language.id}
            selected={language.id === lastUsedLanguage}
          >
            <LanguageIcon slot="icon" language={language.id} />
          </SelectOption>
        {/each}
        <SelectTrigger slot="trigger" />
      </Select>
      <!-- <select name="language" id="language" bind:value={$form.language}>
        {#each data.languages as language}
          <option value={language.id}>{language.name}</option>
        {/each}
      </select> -->
    </div>
    <div>
      <label for="public">public</label>
      <input type="checkbox" name="public" id="public" bind:checked={$form.public} />
    </div>
    <button type="submit">done!</button>
  </form>
{/if}
