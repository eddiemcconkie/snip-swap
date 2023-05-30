<script lang="ts">
  type Color = 'primary' | 'accent';
  type Style = 'solid' | 'outlined' | 'ghost';

  export let color: Color = 'primary';
  export let style: Style;

  export let href: string | null = null;
</script>

{#if href}
  <a class="button" data-color={color} data-style={style} {...$$restProps} {href} on:click>
    <slot name="icon" />
    <slot />
  </a>
{:else}
  <button class="button" data-color={color} data-style={style} {...$$restProps} on:click>
    <slot name="icon" />
    <slot />
  </button>
{/if}

<style lang="postcss">
  button,
  a {
    display: flex;
    align-items: center;
    padding: 0.4em 0.8em;
    gap: 0.4em;
    text-decoration: none;
    line-height: 1;
    background-color: transparent;
    border: 0;
    /* border-radius: 100vw; */
    border-radius: 0.8em;
    border: 0.1em solid var(--button-border-color);
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

      [data-style='outlined'] {
        background-color: var(--surface-0);
        color: var(--on-surface);
      }
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
</style>
