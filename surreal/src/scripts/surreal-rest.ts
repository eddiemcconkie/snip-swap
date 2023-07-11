import fs from 'node:fs';
import { RestResponse, SurrealRootConfig, rootInstance } from '..';

export const db = {
  async export(config: SurrealRootConfig, fileName: string) {
    const response = await rootInstance(config).get<string>('/export', {
      headers: {
        Accept: 'application/octet-stream',
      },
    });
    fs.writeFileSync(fileName, response.data);
  },

  async import(config: SurrealRootConfig, fileName: string) {
    const fileData = fs.readFileSync(fileName).toString();
    const response = await rootInstance(config).post<RestResponse[]>('/import', fileData, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
  },

  async sql(config: SurrealRootConfig, query: string) {
    const response = await rootInstance(config).post('/sql', query, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
  },
};
