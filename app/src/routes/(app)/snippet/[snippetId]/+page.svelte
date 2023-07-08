<script lang="ts">
  import ScrollContainer from '$lib/components/layout/scroll-container.svelte';
  import Snippet from '$lib/components/snippet.svelte';

  export let data;
</script>

<ScrollContainer>
  <Snippet snippet={data.snippet} comments="all" />
</ScrollContainer>
