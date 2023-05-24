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

CREATE language:javascript SET name = 'JavaScript';
CREATE language:typescript SET name = 'TypeScript';
CREATE language:svelte SET name = 'Svelte';
CREATE language:html SET name = 'HTML';
CREATE language:css SET name = 'CSS';
CREATE language:md SET name = 'Markdown';
CREATE language:sql SET name = 'SQL';
CREATE language:rust SET name = 'Rust';
CREATE language:python SET name = 'Python';
CREATE language:java SET name = 'Java';
CREATE language:cpp SET name = 'C++';
CREATE language:plain SET name = 'Plain Text';
