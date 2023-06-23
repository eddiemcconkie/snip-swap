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
CREATE language:cpp SET name = 'C++';
CREATE language:csharp SET name = 'C#';
CREATE language:css SET name = 'CSS';
CREATE language:html SET name = 'HTML';
CREATE language:java SET name = 'Java';
CREATE language:javascript SET name = 'JavaScript';
CREATE language:json SET name = 'JSON';
CREATE language:md SET name = 'Markdown';
CREATE language:php SET name = 'PHP';
CREATE language:python SET name = 'Python';
CREATE language:rust SET name = 'Rust';
CREATE language:scss SET name = 'SCSS';
CREATE language:svelte SET name = 'Svelte';
CREATE language:sql SET name = 'SQL';
CREATE language:typescript SET name = 'TypeScript';
CREATE language:vue SET name = 'Vue';
