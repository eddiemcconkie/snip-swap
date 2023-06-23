<script lang="ts">
  import { codemirror } from './codemirror';

  export let startWith = '';
  export let language: string;
  export let readonly = false;

  export let code = '';
</script>

<div
  use:codemirror={{
    startWith,
    language,
    readonly,
    onUpdate(updatedCode) {
      code = updatedCode;
    },
  }}
  class="step--1"
/>
<input type="hidden" name="code" bind:value={code} />
