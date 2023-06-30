<script lang="ts">
  import Button from '../button.svelte';

  export let formaction = '';
</script>

<Button color="accent" style="solid" type="submit" {formaction}>
  <slot>submit</slot>
</Button>
