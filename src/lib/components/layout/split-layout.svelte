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
  <main>
    <slot name="main" />
  </main>

  <aside class="bg-surface-1 p-2xs-xs">
    <slot name="sidebar" />
  </aside>

  <div class="medium-screen-only | fab step-1">
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
    overflow-y: auto;
    grid-area: main;
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

  /* [data-sidebar='open'] {
    > main {
      pointer-events: none;
    }
    > aside {
      translate: 0 0;
      pointer-events: auto;
    }
  }
  [data-sidebar='closed'] {
    > main {
      pointer-events: auto;
    }
    > aside {
      pointer-events: none;
    }
  }
  @media (--large-screen) {
    [data-sidebar] > :is(main, aside) {
      pointer-events: auto;
    }
  } */

  .medium-screen-only {
    display: none;

    @media (--medium-screen) {
      display: block;
    }

    @media (--large-screen) {
      display: none;
    }
  }
</style>
