<!-- <p class="step--1 bg-error color-on-error border-error"> -->
<p
  class="step--1 bg-error color-on-error radius-3xs px-2xs py-3xs flex align-center justify-center gap-2xs"
>
  <i-heroicons:exclamation-circle-20-solid class="color-on-error step-0" />
  <slot />
</p>

<style>
  p {
    border: 2px solid var(--border-color-error);
  }
</style>
