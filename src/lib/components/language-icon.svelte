<script lang="ts">
  export let language: string;
</script>

{#if language === 'cpp'}
  <i-logos:c-plusplus />
{:else if language === 'csharp'}
  <i-logos:c-sharp />
{:else if language === 'css'}
  <i-logos:css-3 />
{:else if language === 'html'}
  <i-logos:html-5 />
{:else if language === 'java'}
  <i-logos:java />
{:else if language === 'javascript'}
  <i-logos:javascript />
{:else if language === 'json'}
  <i-logos:json />
{:else if language === 'md'}
  <!-- <i-logos:markdown?mask /> -->
  <span class="i-logos:markdown?mask" />
{:else if language === 'php'}
  <i-logos:php />
{:else if language === 'python'}
  <i-logos:python />
{:else if language === 'rust'}
  <!-- <i-logos:rust?mask /> -->
  <span class="i-logos:rust?mask" />
{:else if language === 'scss'}
  <i-logos:sass />
{:else if language === 'sql'}
  <i-logos:postgresql />
{:else if language === 'svelte'}
  <i-logos:svelte-icon />
{:else if language === 'typescript'}
  <i-logos:typescript-icon />
{:else if language === 'vue'}
  <i-logos:vue />
{/if}
