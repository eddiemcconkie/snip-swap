<script lang="ts">
  export let title: string;
</script>

<p class="mb-2xs"><strong>{title}</strong></p>
<div class="step--1 mb-m">
  <slot />
</div>
