DEFINE TABLE language SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create, update, delete
      NONE
;

DEFINE FIELD name ON language
  TYPE string
  ASSERT $value != NONE
;

-- Needs to match '/src/lib/schema/language.ts'
UPDATE language:cpp SET name = 'C++';
UPDATE language:csharp SET name = 'C#';
UPDATE language:css SET name = 'CSS';
UPDATE language:html SET name = 'HTML';
UPDATE language:java SET name = 'Java';
UPDATE language:javascript SET name = 'JavaScript';
UPDATE language:md SET name = 'Markdown';
UPDATE language:php SET name = 'PHP';
UPDATE language:python SET name = 'Python';
UPDATE language:rust SET name = 'Rust';
UPDATE language:scss SET name = 'SCSS';
UPDATE language:svelte SET name = 'Svelte';
UPDATE language:sql SET name = 'SQL';
UPDATE language:typescript SET name = 'TypeScript';
UPDATE language:vue SET name = 'Vue';
