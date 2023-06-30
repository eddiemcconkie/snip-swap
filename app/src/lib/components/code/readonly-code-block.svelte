<script lang="ts">
  import { codemirrorReadonly } from './codemirror';

  export let code: string;
  export let language: string;

  function escape(html: string) {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return html.replace(/[&<>"']/g, (match) => entities[match]);
  }
</script>

<div use:codemirrorReadonly={{ code, language }} class="step--1 bg-surface-2">
  <!-- Display the code during SSR -->
  <pre>{@html code
      .split('\n')
      .map((line) => `<code>${escape(line)}</code>`)
      .join('')}</pre>
</div>

<style>
  /* Match code mirror styles so there's no layout shift */
  pre {
    line-height: 1.4;
    padding: 4px 2px 4px 6px;
    white-space: break-spaces;
    word-wrap: break-word;
  }
</style>
