import { indentWithTab } from '@codemirror/commands';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { nord } from 'cm6-theme-nord';
import { basicSetup } from 'codemirror';

// Languages
// import { cpp } from '@codemirror/lang-cpp';
// import { css } from '@codemirror/lang-css';
// import { html } from '@codemirror/lang-html';
// import { java } from '@codemirror/lang-java';
// import { javascript } from '@codemirror/lang-javascript';
// import { json } from '@codemirror/lang-json';
// import { php } from '@codemirror/lang-php';
// import { python } from '@codemirror/lang-python';
// import { rust } from '@codemirror/lang-rust';
// import { sass } from '@codemirror/lang-sass';
// import { sql } from '@codemirror/lang-sql';
// import { vue } from '@codemirror/lang-vue';
// import { csharp } from '@replit/codemirror-lang-csharp';
// import { svelte } from '@replit/codemirror-lang-svelte';

type CodeMirrorOptions = {
  startWith: string;
  language: string;
  readonly: boolean;
  onUpdate: (code: string) => void;
};
const codeMirrorDefaults: CodeMirrorOptions = {
  startWith: '',
  language: 'plain',
  readonly: false,
  onUpdate() {},
} as const;

export function codemirror(node: HTMLElement, options: Partial<CodeMirrorOptions> = {}) {
  let opts = { ...codeMirrorDefaults, ...options };

  const languageConfig = new Compartment();

  let state = EditorState.create({
    doc: opts.startWith,
    extensions: [
      basicSetup,
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      // languageConfig.of(getLanguageSupport(opts.language)),
      // languageConfig.of(markdown()),
      languageConfig.of([]),
      EditorView.editable.of(!opts.readonly),
      EditorState.readOnly.of(opts.readonly),
      nord,
      EditorView.updateListener.of((update) => {
        opts.onUpdate(update.state.doc.toString());
      }),
    ],
  });
  const view = new EditorView({
    state,
    parent: node,
  });

  async function updateLanguage(language: string) {
    view.dispatch({
      effects: languageConfig.reconfigure(await getLanguageSupport(language)),
    });
  }

  updateLanguage(opts.language);

  return {
    update(newOpts: Partial<CodeMirrorOptions>) {
      // Update language
      if (newOpts.language && opts.language !== newOpts.language) {
        updateLanguage(newOpts.language);
      }
      opts = { ...opts, ...newOpts };
    },
    destroy() {
      view.destroy();
    },
  };
}

export function codemirrorReadonly(node: HTMLElement, options: { code: string; language: string }) {
  // Clear unstyled text
  node.innerHTML = '';

  const languageConfig = new Compartment();

  let state = EditorState.create({
    doc: options.code,
    extensions: [
      EditorView.lineWrapping,
      // getLanguageSupport(options.language),
      // languageConfig.of(markdown()),
      languageConfig.of([]),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      nord,
    ],
  });
  const view = new EditorView({
    state,
    parent: node,
  });

  async function updateLanguage(language: string) {
    view.dispatch({
      effects: languageConfig.reconfigure(await getLanguageSupport(language)),
    });
  }

  updateLanguage(options.language);

  return {
    destroy() {
      view.destroy();
    },
  };
}

async function getLanguageSupport(language: string) {
  switch (language) {
    case 'cpp':
      // return cpp();
      return (await import('@codemirror/lang-cpp')).cpp();
    case 'csharp':
      // return csharp();
      return (await import('@replit/codemirror-lang-csharp')).csharp();
    case 'css':
      // return css();
      return (await import('@codemirror/lang-css')).css();
    case 'html':
      // return html();
      return (await import('@codemirror/lang-html')).html();
    case 'java':
      // return java();
      return (await import('@codemirror/lang-java')).java();
    case 'javascript':
      // return javascript({ jsx: true });
      return (await import('@codemirror/lang-javascript')).javascript({ jsx: true });
    case 'json':
      // return json();
      return (await import('@codemirror/lang-json')).json();
    case 'markdown':
      // return markdown();
      return (await import('@codemirror/lang-markdown')).markdown();
    case 'php':
      // return php();
      return (await import('@codemirror/lang-php')).php();
    case 'python':
      // return python();
      return (await import('@codemirror/lang-python')).python();
    case 'rust':
      // return rust();
      return (await import('@codemirror/lang-rust')).rust();
    case 'scss':
      // return sass({ indented: false });
      return (await import('@codemirror/lang-sass')).sass({ indented: false });
    case 'svelte':
      // return svelte();
      return (await import('@replit/codemirror-lang-svelte')).svelte();
    case 'sql':
      // return sql();
      return (await import('@codemirror/lang-sql')).sql();
    case 'typescript':
      // return javascript({ jsx: true, typescript: true });
      return (await import('@codemirror/lang-javascript')).javascript({
        jsx: true,
        typescript: true,
      });
    case 'vue':
      // return vue();
      return (await import('@codemirror/lang-vue')).vue();
    default:
      // return markdown();
      return (await import('@codemirror/lang-markdown')).markdown();
  }
}
