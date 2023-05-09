import { z } from 'zod';

export const addTable = (table: string, id: string) =>
  id.startsWith(table) ? id : `${table}:⟨${id}⟩`;

export const removeTable = (id: string) => {
  const bracketId = /^.+:⟨(.+)⟩$/; // auth_key:⟨github:12345⟩
  const regularId = /.+:(.+)/; // auth_session:67890
  return bracketId.exec(id)?.[1] ?? regularId.exec(id)?.[1] ?? id;
};

export const idWithoutTable = () => z.string().transform(removeTable);
