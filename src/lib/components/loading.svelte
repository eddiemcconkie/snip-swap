<script lang="ts">
  import { onMount } from 'svelte';

  export let delay = 0;

  let visibility = 'hidden';

  onMount(() => {
    const timeout = setTimeout(() => {
      visibility = 'visible';
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<div class="flex justify-center">
  <!-- <i-svg-spinners:6-dots-scale-middle class="step-4" style:visibility /> -->
  <i-svg-spinners:6-dots-scale-middle style:visibility />
</div>
