import { componentGroup } from '$lib/helpers/component-group';
import SelectDivider from './select-divider.svelte';
import SelectOption from './select-option.svelte';
import SelectTrigger from './select-trigger.svelte';
import Select_ from './select.svelte';

export const Select = componentGroup(Select_, {
  Divider: SelectDivider,
  Option: SelectOption,
  Trigger: SelectTrigger,
});

export type Selected = { value: string; label: string } | null;
