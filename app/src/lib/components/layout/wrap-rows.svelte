<script lang="ts" generics="T">
  export let items: T[];

  export { classes as class };
  let classes = '';
</script>

<ul class="flex wrap gap-2xs {classes}">
  {#each items as item}
    <li>
      <slot {item} />
    </li>
  {/each}
</ul>
