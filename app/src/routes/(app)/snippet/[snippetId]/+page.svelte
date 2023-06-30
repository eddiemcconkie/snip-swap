<script lang="ts">
  import Snippet from '$lib/components/snippet.svelte';

  export let data;
</script>

<!-- <h1>view snippet</h1>

<p>created by <a href="/user/{data.snippet.owner.username}">{data.snippet.owner.name}</a></p>
<pre>{data.snippet.code}</pre>
<p>{data.snippet.description}</p>
<p>{data.snippet.language.name}</p> -->

<Snippet snippet={data.snippet} />
