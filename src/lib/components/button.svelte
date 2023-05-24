<script lang="ts">
  type Color = 'primary' | 'accent';

  export let color: Color = 'primary';
  export let outlined = false;

  export let href: string | null = null;
</script>

{#if href}
  <a class="button" data-color={color} data-outlined={outlined} {...$$restProps} {href} on:click>
    <slot name="icon" />
    <slot />
  </a>
{:else}
  <button class="button" data-color={color} data-outlined={outlined} {...$$restProps} on:click>
    <slot name="icon" />
    <slot />
  </button>
{/if}

<style>
  button,
  a {
    display: flex;
    align-items: center;
    padding: 0.4em;
    gap: 0.4em;
    text-decoration: none;
    line-height: 1;
    background-color: transparent;
    border: 0;
    border-radius: 100vw;
    border: 0.15em solid var(--border-color);
  }

  /* Color */
  [data-color='primary'] {
    background-color: var(--primary-2);
    color: var(--on-primary);
    --border-color: var(--primary-2);
  }
  [data-color='primary']:is(:hover, :focus-visible) {
    /* background-color: var(--primary-highlight); */
    background-color: var(--primary-0);
    /* color: var(--on-primary-highlight); */
    color: var(--on-primary);
    --border-color: var(--primary-0);
  }
  [data-color='accent'] {
    background-color: var(--accent-2);
    color: var(--on-accent);
    --border-color: var(--accent-2);
  }
  [data-color='accent']:is(:hover, :focus-visible) {
    background-color: var(--accent-0);
    color: var(--on-accent);
    --border-color: var(--accent-0);
  }

  /* Outline */
  [data-outlined='true'] {
    background-color: var(--surface-1);
    color: var(--on-surface);
  }
  /* [data-outlined='true'][data-color='primary'] {
    --border-color: var(--primary-1);
  }
  [data-outlined='true'][data-color='accent'] {
    --border-color: var(--accent-0);
  } */
</style>
