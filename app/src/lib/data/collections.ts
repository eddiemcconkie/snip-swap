import { collectionSchema, organizedSchema, savedSchema, snippetSchema } from '@snipswap/schema';
import { surql, type Surreal } from '@snipswap/surreal';
import { z } from 'zod';

export async function getCollections(db: Surreal) {
  const [collections] = await db.query(surql`SELECT * FROM collection`, collectionSchema.array());

  return { collections };
}

export async function getCollection(db: Surreal, collectionId: string) {
  const [collection] = await db.query(
    surql`
      RETURN (
        SELECT * FROM type::thing('collection', ${collectionId})
      )[0]
    `,
    collectionSchema.nullable(),
  );

  return { collection };
}

export async function getCollectionByName(db: Surreal, name: string) {
  const [collection] = await db.query(
    surql`
      RETURN (
        SELECT * FROM collection WHERE name = type::string(${name})
      )[0]
    `,
    collectionSchema.nullable(),
  );

  return { collection };
}

export async function getCollectionSnippets(db: Surreal, collectionId: string) {
  const [snippets] = await db.query(
    surql`
      SELECT VALUE ->saved[WHERE collection = type::thing('collection', ${collectionId})]->snippet AS snippets
      FROM $auth
      FETCH snippets
    `,
    snippetSchema.array(),
  );

  return { snippets };
}

export async function createCollection(db: Surreal, name: string) {
  const [_, collection, organized] = await db.query(
    surql`
      BEGIN;
      LET $newCollection = (CREATE collection SET name = type::string(${name}));
      SELECT * FROM $newCollection;
      RELATE $auth->organized->$newCollection;
      COMMIT;
    `,
    z.null(),
    collectionSchema.array(),
    organizedSchema.array(),
  );

  return { collection };
}

export async function addSnippetToCollection(db: Surreal, collectionId: string, snippetId: string) {
  const [saved] = await db.query(
    surql`
      UPDATE saved
      SET collection = type::thing('collection', ${collectionId})
      WHERE in = $auth AND out = type::thing('snippet', ${snippetId})
    `,
    savedSchema.array(),
  );

  return { saved };
}

export async function removeSnippetFromCollection(db: Surreal, snippetId: string) {
  const [update] = await db.query(
    surql`
    SELECT * FROM (
      UPDATE saved
      SET collection = NONE
      WHERE --in = $auth AND 
      out = type::thing('snippet', ${snippetId})
    )
    `,
    savedSchema.array(),
  );

  return { update };
}
