import fetch from 'node-fetch';
import fs from 'fs';
import { config } from 'dotenv';
config();

const { PUBLIC_SURREAL_HOST, SURREAL_USER, SURREAL_PASS, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } =
  process.env;

const Authorization = `Basic ${Buffer.from(`${SURREAL_USER}:${SURREAL_PASS}`).toString('base64')}`;

/**
 * @type {{
 * export: (fileName: string) => Promise<void>,
 * import: (fileName: string) => Promise<{
 *   time: string,
 *   status: 'OK' | 'ERR',
 *   result: unknown
 * }[]>,
 * sql: (query: string) => Promise<{
 *   time: string,
 *   result: unknown
 * }[]>
 * }}
 */
export const db = {
  async export(fileName) {
    const res = await fetch(`${PUBLIC_SURREAL_HOST}/export`, {
      headers: {
        Authorization,
        Accept: 'application/octet-stream',
        NS: PUBLIC_SURREAL_NS,
        DB: PUBLIC_SURREAL_DB,
      },
    });
    const text = await res.text();
    fs.writeFileSync(fileName, text);
  },

  async import(fileName) {
    const fileData = fs.readFileSync(fileName).toString();
    const res = await fetch(`${PUBLIC_SURREAL_HOST}/import`, {
      method: 'post',
      headers: {
        Authorization,
        Accept: 'application/json',
        NS: PUBLIC_SURREAL_NS,
        DB: PUBLIC_SURREAL_DB,
      },
      body: fileData,
    });
    return await res.json();
  },

  async sql(query) {
    const res = await fetch(`${PUBLIC_SURREAL_HOST}/sql`, {
      method: 'post',
      headers: {
        Authorization,
        Accept: 'application/json',
        NS: PUBLIC_SURREAL_NS,
        DB: PUBLIC_SURREAL_DB,
      },
      body: query,
    });
    return await res.json();
  },
};
