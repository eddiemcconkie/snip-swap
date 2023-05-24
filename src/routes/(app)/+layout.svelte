<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/button.svelte';
  import { resize } from '$lib/helpers/image';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import logoSmall from '../../assets/logo-small.svg';

  let menuOpen = false;

  const navLinks = [
    { text: 'home', path: '/' },
    { text: 'saved', path: '/saved' },
    { text: 'new snippet', path: '/snippet' },
  ] as const;

  /**
   * Pages can optionally define a callback function for when the page action button
   * is pressed (small screens only)
   */
  const pageAction = writable<(() => void) | null>(null);
  setContext('pageAction', pageAction);
</script>

<svelte:window
  on:resize={() => {
    menuOpen = false;
  }}
/>

<div class="layout">
  <header class="header | bg-surface-1 pt-2xs pb-xs">
    <img src={logoSmall} alt="snipswap" />
    <button
      class="small-only"
      on:click={() => {
        menuOpen = !menuOpen;
      }}
    >
      {#if menuOpen}
        <i-heroicons:x-mark aria-label="close menu" />
      {:else}
        <i-heroicons:bars-3-bottom-right aria-label="open menu" />
      {/if}
    </button>
  </header>
  <nav class="nav | bg-surface-1">
    <ul class="px-xs gap-xs">
      {#each navLinks as { text, path } (path)}
        {@const isCurrentPage = $page.url.pathname === path}
        <li class:current-page={isCurrentPage}>
          <Button
            color="primary"
            outlined={!isCurrentPage}
            href={path}
            aria-current={isCurrentPage ? 'page' : false}
          >
            <svelte:fragment slot="icon">
              {#if path === '/'}
                <i-heroicons:home-solid />
              {:else if path === '/saved'}
                <i-heroicons:bookmark-solid />
              {:else if path === '/snippet'}
                <i-heroicons:pencil-solid />
              {/if}
            </svelte:fragment>
            <span class="medium-and-up">{text}</span>
          </Button>
        </li>
      {/each}
      {#if $pageAction}
        <li class="page-action | small-only" transition:fly={{ y: 50 }}>
          <Button color="accent" on:click={$pageAction}>
            <i-heroicons:magnifying-glass-solid slot="icon" />
            <span class="medium-and-up">search</span>
          </Button>
        </li>
      {/if}
    </ul>
  </nav>
  <div class="menu | bg-surface-1 p-xs" data-open={menuOpen}>
    {#if $page.data.user}
      {@const displayName = $page.data.user.name ?? $page.data.user.username}
      <img src={resize($page.data.user.avatar, 100)} alt={displayName} width="30" height="30" />
      <span>{displayName}</span>
    {/if}
    <p>
      {#if $page.data.user}
        <a href="/signout">Sign out</a>
      {:else}
        <a href="/signin?redirectTo={$page.url.pathname}">Sign in</a>
      {/if}
    </p>
    <p>
      <a href="/sandbox">Sandbox</a>
    </p>
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  /* .nav, */
  .menu,
  .content {
    overflow-y: auto;
  }

  .layout {
    height: 100%;
    display: grid;
    grid-template-areas:
      'header'
      'content'
      'nav';
    /* grid-template-areas:
      'header header'
      'content menu'
      'nav menu'; */
    grid-template-rows: auto 1fr auto;
    /* grid-template-columns: 1fr auto; */
  }
  .header {
    position: relative;
    z-index: 999;
    grid-area: header;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
  /* Logo in center and menu button on right */
  .header > :first-child {
    grid-column: 2;
  }
  .header > :nth-child(2) {
    justify-self: end;
  }
  .nav {
    grid-area: nav;
    position: sticky;
    bottom: 0;
    font-size: var(--step-1);
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

  .menu {
    grid-area: menu;
    position: fixed;
    inset: 0 0 0 auto;
    transition: translate 300ms;
    padding-top: 3rem; /* Change this */
  }
  .menu[data-open='false'] {
    translate: 100% 0;
  }
  .content {
    grid-area: content;
  }

  .current-page,
  .page-action {
    transform-origin: bottom;
    scale: 1.15;
  }

  .medium-and-up {
    display: none;
  }

  @media (min-width: 40rem) {
    .layout {
      grid-template-areas:
        'header content'
        'nav    content'
        'menu   content';
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 200px 1fr;
    }

    .nav {
      overflow-y: auto;
      font-size: var(--step-0);
    }
    .nav > ul {
      flex-direction: column;
      justify-content: start;
    }
    .nav > ul > li {
      translate: 0;
    }

    .menu {
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

    .small-only {
      display: none;
    }
    .medium-and-up {
      display: block;
    }
  }

  @media (min-width: 60rem) {
    /* .layout {
      grid-template-areas:
        'header content'
        'nav content'
        'menu content';
      grid-template-rows: auto 1fr;
      grid-template-columns: auto 1fr;
    } */
  }
</style>
