import type { ComponentType } from 'svelte';

export function componentGroup<
  TParentComponent extends ComponentType,
  TChildComponents extends Record<string, ComponentType>,
>(
  parentComponent: TParentComponent,
  childComponents: TChildComponents,
): TParentComponent & TChildComponents {
  const group: any = parentComponent;
  for (const [name, component] of Object.entries(childComponents)) {
    group[name] = component;
  }
  return group;
}
