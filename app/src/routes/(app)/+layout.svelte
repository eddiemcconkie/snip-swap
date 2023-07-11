<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import Button from '$lib/components/button.svelte';
  import Loading from '$lib/components/loading.svelte';
  import { createPageActionContext } from '$lib/context/page-action';
  import { resize } from '$lib/helpers/image';
  import { slide } from 'svelte/transition';
  import logoFull from '/src/assets/logo-full.svg';

  let menuOpen = false;

  const navLinks = [
    { text: 'home', path: '/' },
    { text: 'saved', path: '/saved' },
    { text: 'new snippet', path: '/snippet' },
  ] as const;

  afterNavigate(() => {
    menuOpen = false;
  });

  /**
   * Pages can optionally define a callback function for when the page action button
   * is pressed (small screens only)
   */
  const pageAction = createPageActionContext();
</script>

<svelte:window
  on:resize={() => {
    menuOpen = false;
  }}
/>

<div class="layout | full-height">
  <header class="header | bg-surface-1 p-3xs">
    <div class="px-xs">
      {#if $navigating}
        <Loading delay={500} />
      {/if}
    </div>
    <img src={logoFull} alt="snipswap" />
    <div class="screen:s">
      <Button
        style="ghost"
        on:click={() => {
          menuOpen = !menuOpen;
        }}
      >
        {#if menuOpen}
          <i-heroicons:x-mark aria-label="close menu" />
        {:else}
          <i-heroicons:bars-3-bottom-right aria-label="open menu" />
        {/if}
      </Button>
    </div>
  </header>
  <nav class="nav | bg-surface-1">
    <ul class="px-xs gap-xs">
      {#each navLinks as { text, path } (path)}
        {@const isCurrentPage = $page.url.pathname === path}
        <li class:current-page={isCurrentPage}>
          <Button
            color="primary"
            style={isCurrentPage ? 'solid' : 'outlined'}
            href={path}
            aria-current={isCurrentPage ? 'page' : false}
          >
            {#if path === '/'}
              <i-heroicons:home-20-solid />
            {:else if path === '/saved'}
              <i-heroicons:bookmark-20-solid />
            {:else if path === '/snippet'}
              <i-heroicons:pencil-20-solid />
            {/if}
            <span class="screen:m-l">{text}</span>
          </Button>
        </li>
      {/each}
      {#if $pageAction}
        <!-- <li class="page-action | small-only" transition:fly={{ y: 50 }}> -->
        <li class="page-action | screen:s" transition:slide={{ axis: 'x', duration: 200 }}>
          <Button color="accent" style="solid" on:click={$pageAction}>
            {#if $page.url.pathname === '/'}
              <i-heroicons:magnifying-glass-20-solid aria-label="toggle searchbar" />
            {:else if $page.url.pathname === '/saved'}
              <i-heroicons:folder-open-20-solid aria-label="toggle collections panel" />
            {:else}
              <i-heroicons:question-mark-circle-20-solid />
            {/if}
          </Button>
        </li>
      {/if}
    </ul>
  </nav>
  <div class="menu | bg-surface-1 p-xs scroll-y" data-open={menuOpen}>
    <ul>
      {#if $page.data.user}
        <li>
          <Button href="/">
            <img
              src={resize($page.data.user.avatar, 100)}
              alt={$page.data.user.name}
              width="30"
              height="30"
              class="avatar | radius-round"
            />
            <span>{$page.data.user.name}</span>
          </Button>
        </li>
        <li>
          <Button href="/extension">
            <span class="i-logos:visual-studio-code?mask" />
            extension
          </Button>
        </li>
        <li>
          <Button href="https://github.com/eddiemcconkie/snip-swap/issues" external>
            <span class="i-logos:github-icon?mask" />
            report an issue
          </Button>
        </li>
        <li>
          <Button href="/signout">
            <i-heroicons:arrow-left-on-rectangle-20-solid />
            sign out
          </Button>
        </li>
      {:else}
        <li>
          <Button href="/signin?redirectTo={$page.url.pathname}" style="solid">sign in</Button>
        </li>
      {/if}
    </ul>
  </div>
  <div class="content | full-height">
    <slot />
  </div>
</div>

<style lang="postcss">
  @import '/src/styles/breakpoints.postcss';

  .layout {
    height: 100%;
    display: grid;
    grid-template-areas:
      'header'
      'content'
      'nav';
    grid-template-rows: auto 1fr auto;
  }

  .menu {
    position: relative;
    z-index: 9999;
    grid-area: 2 / 1 / -1 / -1; /* Covers content and nav */
    transition: translate 300ms;
  }
  .menu[data-open='false'] {
    translate: 100% 0;
  }

  .header {
    position: relative;
    z-index: 99999;
    grid-area: header;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-block-end: var(--border-dark);
  }
  /* Logo in center and menu button on right */
  /* .header > :first-child {
    grid-column: 2;
  } */
  .header > :first-child {
    justify-self: start;
  }
  .header > :last-child {
    justify-self: end;
  }

  .nav {
    grid-area: nav;
    position: sticky;
    bottom: 0;
    font-size: var(--step-1);
    z-index: 999;
  }
  .nav > ul {
    margin: auto;
    max-width: 400px;
    display: flex;
    justify-content: space-evenly;
  }
  .nav > ul > li {
    translate: 0 -30%;
  }

  .content {
    grid-area: content;
  }

  .current-page,
  .page-action {
    transform-origin: bottom;
    scale: 1.15;
  }

  @media (--medium-screen) {
    .layout {
      grid-template-areas:
        'header content'
        'nav    content'
        'menu   content';
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 250px 1fr;
    }

    .header {
      border-block-end: 0;
    }

    .nav {
      overflow-y: auto;
      font-size: var(--step-0);
      padding-block-start: var(--space-l);
    }
    .nav > ul {
      flex-direction: column;
      justify-content: start;
    }
    .nav > ul > li {
      translate: 0;
    }

    .menu {
      grid-area: menu;
      position: static;
      transition: translate 0s;
    }
    .menu[data-open='false'] {
      translate: 0 0;
    }

    .current-page,
    .page-action {
      scale: 1;
    }

    .header,
    .nav,
    .menu {
      border-inline-end: var(--border-dark);
    }
  }

  .avatar {
    width: 1em;
    height: 1em;
  }
</style>
