import { z } from 'zod';

export function addTable(table: string, record: string) {
  return record.startsWith(table) ? record : `${table}:⟨${record}⟩`;
}

export function removeTable(record: string) {
  const bracketId = /^.+:⟨(.+)⟩$/; // auth_key:⟨github:12345⟩ -> github:12345
  const regularId = /.+:(.+)/; // auth_session:67890 -> 67890
  const result = bracketId.exec(record)?.[1] ?? regularId.exec(record)?.[1] ?? record;
  if (result.length === 0) throw new Error();
  return result;
}

export function record() {
  return z.string().transform(removeTable);
}

export function nullableRecord() {
  return z
    .string()
    .nullable()
    .transform((record) => (record ? removeTable(record) : null));
}
export function firstOrNull<T>(items: T[]) {
  return items[0] ?? null;
}
export function firstNullableRecord() {
  return nullableRecord().array().transform(firstOrNull);
}
