<script lang="ts">
  import Button from '../button.svelte';

  export let sidebarOpen = false;
</script>

<svelte:window
  on:resize={() => {
    sidebarOpen = false;
  }}
/>

<div class="split-layout | full-height" data-sidebar={sidebarOpen ? 'open' : 'closed'}>
  <!-- <main class="px-s"> -->
  <main class="full-height">
    <div class="main-header | bg-surface-0 border-dark-b"><slot name="main-header" /></div>
    <div class="main-content"><slot name="main" /></div>
  </main>

  <aside class="bg-surface-1 p-2xs-xs">
    <slot name="sidebar" />
  </aside>

  <div class="screen:m | fab step-1">
    <!-- <div class="medium-screen-only | fab step-1"> -->
    <Button color="accent" style="solid" on:click={() => (sidebarOpen = !sidebarOpen)}>
      <slot name="fab-icon" />
    </Button>
  </div>
</div>

<style lang="postcss">
  @import '/src/styles/breakpoints.postcss';

  .split-layout {
    display: grid;
    position: relative;
    grid-template-areas: 'main';

    @media (--large-screen) {
      grid-template-areas: 'main sidebar';
      grid-template-columns: 5fr 3fr;
    }
  }

  main {
    grid-area: main;
    display: grid;
    grid-template-rows: auto 1fr;
  }
  .main-header:empty {
    display: contents;
  }
  .main-content {
    overflow-y: auto;
  }

  aside {
    grid-area: main;

    translate: 0 100%;
    transition: translate 300ms;

    @media (--medium-screen) {
      translate: 100% 0;
    }

    @media (--large-screen) {
      grid-area: sidebar;
      translate: 0 0;
      border-inline-start: var(--border-dark);
    }
  }

  [data-sidebar='open'] > aside {
    translate: 0 0;
  }
</style>
