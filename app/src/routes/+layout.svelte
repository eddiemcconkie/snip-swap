<script>
  import ModalOutlet from '$lib/components/modal/modal-outlet.svelte';

  // CUBE CSS styles (import first)
  import '../styles/cube.postcss';
  // UnoCSS Utilities (import last - styles that aren't in a @layer take priority)
  import 'virtual:uno.css';
</script>

<div class="full-height">
  <slot />
</div>

<ModalOutlet />

<style>
  .full-height {
    height: 100vh;
    height: 100lvh;
  }
</style>
