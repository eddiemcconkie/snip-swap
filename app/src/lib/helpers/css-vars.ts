type Size = '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

export function space(s: Size) {
  return `var(--space-${s})`;
}
