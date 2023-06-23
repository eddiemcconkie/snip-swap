import { z } from 'zod';
import { record } from './id';

// Should match /db/schema/language.surql
const languageMap: Record<string, string> = {
  cpp: 'C++',
  csharp: 'C#',
  css: 'CSS',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  md: 'Markdown',
  php: 'PHP',
  python: 'Python',
  rust: 'Rust',
  scss: 'SCSS',
  svelte: 'Svelte',
  sql: 'SQL',
  typescript: 'TypeScript',
  vue: 'Vue',
} as const;

export const languages = Object.entries(languageMap)
  .map(([id, name]) => ({ id, name }))
  .sort((a, b) => (a.id > b.id ? 1 : -1));

export function getLanguageDisplay(lang: string) {
  return languageMap[lang] ?? '';
}

export const languageSchema = z.object({
  // id: record().refine((arg) => Object.keys(languageMap).includes(arg), {
  id: record(),
  name: z.string().trim().min(1),
});
