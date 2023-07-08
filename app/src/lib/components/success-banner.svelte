<!-- <p class="step--1 bg-error color-on-error border-error"> -->
<p
  class="step--1 bg-success color-on-success radius-3xs px-2xs py-3xs flex align-center justify-center gap-2xs wrap"
>
  <i-heroicons:check-circle-20-solid class="color-on-success step-0" />
  <slot />
</p>

<style>
  p {
    border: 2px solid var(--border-color-success);
  }
</style>
