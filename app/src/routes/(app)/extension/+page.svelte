<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import SigninPrompt from '$lib/components/auth/signin-prompt.svelte';
  import Button from '$lib/components/button.svelte';
  import CopyButton from '$lib/components/copy-button.svelte';
  import ScrollContainer from '$lib/components/layout/scroll-container.svelte';
  import SuccessBanner from '$lib/components/success-banner.svelte';
  import { formatSince } from '$lib/helpers/since.js';

  export let data;

  let loading = false;

  $: apiKey = $page.form?.apiKey;
</script>

<ScrollContainer class="px-xs step--1 flow">
  <h2 class="step-2">VS Code extension</h2>
  {#if data.user}
    <p>API keys give you readonly access to your snippets through the VS Code extension</p>
    <ol role="list">
      <li>Generate an API key below</li>
      <li>Download the VS Code extension!</li>
      <li>
        Enter your API key when prompted, or open the command palette and run <code
          >SnipSwap: API key</code
        > to enter it
      </li>
    </ol>
    <form
      action="?/generateApiKey"
      method="post"
      use:enhance={({ cancel }) => {
        if (loading === true) {
          cancel();
        }

        loading = true;

        return async ({ update }) => {
          await update();
          loading = false;
        };
      }}
      class="flex justify-end mb-s"
    >
      <Button color="accent" style="solid" type="submit" {loading}>generate API key</Button>
    </form>
    {#if apiKey}
      <!-- <div class="flex align-center gap-2xs"> -->
      <SuccessBanner>
        API Key: <code>{apiKey.value}</code>
        <CopyButton value={apiKey.value} />
      </SuccessBanner>
      <!-- </div> -->
    {/if}
    <table>
      <thead>
        <tr>
          <td>prefix</td>
          <td>permissions</td>
          <td>created</td>
        </tr>
      </thead>
      <tbody>
        {#each data.apiKeys as apiKey}
          <tr>
            <td>{apiKey.prefix}</td>
            <td><span class="badge">readonly</span></td>
            <td class="color-on-surface-faint">{formatSince(apiKey.time.since)}</td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" style:text-align="center"> no API keys yet </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <SigninPrompt />
  {/if}
</ScrollContainer>

<style>
  table {
    width: 100%;
  }
  thead {
    background-color: var(--surface-2);
  }
  tbody {
    background-color: var(--surface-1);
  }
  td {
    padding-inline: var(--space-2xs);
  }

  .badge {
    border-radius: 100vw;
    background-color: var(--accent-0);
    color: var(--on-accent);
    padding-inline: var(--space-2xs);
  }
</style>
