import extractorSvelte from '@unocss/extractor-svelte';
import presetIcons from '@unocss/preset-icons';
import presetTagify from '@unocss/preset-tagify';
import { defineConfig } from 'unocss';

const position: Record<string, string[]> = {
  default: ['block-start', 'block-end', 'inline-start', 'inline-end'],
  x: ['inline-start', 'inline-end'],
  y: ['block-start', 'block-end'],
  t: ['block-start'],
  b: ['block-end'],
  l: ['inline-start'],
  r: ['inline-end'],
};

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1,
      extraProperties: {
        display: 'inline-block',
        // 'vertical-align': 'middle',
      },
    }),
    presetTagify(),
  ],
  extractors: [extractorSvelte()],
  rules: [
    // Margin
    [
      /^m([xytblr]?)-(.+)$/,
      ([_, pos, space]) => {
        pos ||= 'default';
        if (!position[pos]) return {};
        return Object.fromEntries(
          position[pos].map((p) => [`margin-${p}`, `var(--space-${space})`]),
        );
      },
    ],

    // Padding
    [
      /^p([xytblr]?)-(.+)$/,
      ([_, pos, space]) => {
        pos ||= 'default';
        if (!position[pos]) return {};
        return Object.fromEntries(
          position[pos].map((p) => [`padding-${p}`, `var(--space-${space})`]),
        );
      },
    ],

    // Border radius
    ['radius-round', { 'border-radius': '100vw' }],
    [/^radius-(.+)$/, ([_, space]) => ({ 'border-radius': `var(--space-${space})` })],

    // Aspect ratio
    ['aspect-square', { 'aspect-ratio': '1 / 1 ' }],
    [/^aspect-(\d+)\/(\d+)$/, ([_, w, h]) => ({ 'aspect-ratio': `${w} / ${h}` })],

    // Font
    [/^step-(\d+|\-\d+)$/, ([_, step]) => ({ 'font-size': `var(--step-${step})` })],
    [/^weight-(.+)$/, ([_, weight]) => ({ 'font-weight': `var(--weight-${weight})` })],

    // Gap
    [/^gap-(.+)$/, ([_, space]) => ({ gap: `var(--space-${space})` })],

    // Color
    [/^color-(.+)$/, ([_, color]) => ({ color: `var(--${color})` })],
    [/^bg-(.+)$/, ([_, color]) => ({ 'background-color': `var(--${color})` })],
  ],
});
