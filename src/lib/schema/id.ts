import { z } from 'zod';

export const addTable = (table: string, record: string) =>
  record.startsWith(table) ? record : `${table}:⟨${record}⟩`;

export const removeTable = (record: string) => {
  const bracketId = /^.+:⟨(.+)⟩$/; // auth_key:⟨github:12345⟩
  const regularId = /.+:(.+)/; // auth_session:67890
  return bracketId.exec(record)?.[1] ?? regularId.exec(record)?.[1] ?? record;
};

export const record = () => z.string().transform(removeTable);
