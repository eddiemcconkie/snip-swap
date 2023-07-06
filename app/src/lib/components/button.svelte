<script lang="ts">
  import Loading from './loading.svelte';

  type Color = 'primary' | 'accent' | 'surface';
  type Style = 'solid' | 'outlined' | 'ghost';

  export let color: Color = 'surface';
  export let style: Style = 'ghost';

  export let href: string | null = null;

  export let external = false;

  export let fullwidth = false;

  export let loading = false;

  let classes = '';
  export { classes as class };
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  class="button | stacked | {classes}"
  data-color={color}
  data-style={style}
  class:fullwidth
  target={external ? '_blank' : null}
  rel={external ? 'noreferrer' : null}
  {href}
  on:click
  role={href ? 'link' : 'button'}
  {...$$restProps}
>
  <span class="flex align-center" style:visibility={loading ? 'hidden' : 'visible'}>
    <slot />
    <!-- {#if external}
      <i-heroicons:arrow-top-right-on-square-20-solid style:font-size="0.8em" class="shrink-0" />
    {/if} -->
  </span>
  <!-- <span class="flex justify-center align-center" style:visibility={loading ? 'visible' : 'hidden'}>
    <i-svg-spinners:6-dots-scale-middle />
  </span> -->
  <span style:display={loading ? 'block' : 'none'}>
    <!-- <span style:visibility={loading ? 'visible' : 'hidden'}> -->
    <Loading delay={100} />
  </span>
</svelte:element>

<style lang="postcss">
  button,
  a {
    /* display: flex; */
    /* display: inline-grid; */
    /* align-items: center; */
    padding: 0.4em 0.8em;
    /* gap: 0.4em; */
    text-decoration: none;
    line-height: 1;
    background-color: transparent;
    border-radius: 100vw;
    /* border-radius: 0.8em; */
    border: 0.1em solid var(--button-border-color, transparent);
    /* overflow-x: hidden;
    white-space: nowrap; */

    > :first-child {
      gap: 0.4em;
    }
  }

  /* Color */
  [data-color='primary'] {
    background-color: var(--primary-2);
    color: var(--on-primary);
    --button-border-color: var(--primary-2);

    &:is(:hover, :focus-visible) {
      background-color: var(--primary-0);
      color: var(--on-primary);
      --button-border-color: var(--primary-0);

      &[data-style='outlined'] {
        background-color: var(--surface-0);
        color: var(--on-surface);
      }
    }
  }
  [data-color='accent'] {
    background-color: var(--accent-2);
    color: var(--on-accent);
    --button-border-color: var(--accent-2);

    &:is(:hover, :focus-visible) {
      background-color: var(--accent-0);
      color: var(--on-accent);
      --button-border-color: var(--accent-0);

      &[data-style='outlined'] {
        background-color: var(--surface-0);
        color: var(--on-surface);
      }
    }
  }
  [data-color='surface'] {
    color: var(--on-surface);

    &:is(:hover, :focus-visible) {
      /* background-color: var(--surface-1); */
      background-color: rgb(0 0 0 / 0.2);
      /* color: var(--on-accent); */
      /* --button-border-color: var(--accent-0); */
    }

    &[data-style='outlined'] {
      /* background-color: var(--surface-0); */
      /* color: var(--on-surface); */
      --button-border-color: var(--surface-3);
    }
  }

  /* Outline */
  [data-style='outlined'] {
    background-color: var(--surface-1);
    color: var(--on-surface);
  }
  /* [data-outlined='true'][data-color='primary'] {
    --button-border-color: var(--primary-1);
  }
  [data-outlined='true'][data-color='accent'] {
    --button-border-color: var(--accent-0);
  } */

  .fullwidth {
    width: 100%;
  }
</style>
