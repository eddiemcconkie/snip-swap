import { PUBLIC_SURREAL_DB, PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS } from '$env/static/public';
import type { z } from 'zod';

type RestResponse<T> =
  | {
      status: 'OK';
      result: T;
      time: string;
    }
  | {
      status: 'ERR';
      detail: string;
      time: string;
    };

type RestResponseError = {
  code: 400;
  details: string;
  description: string;
  information: string;
};

type Auth =
  | {
      scope: 'root';
      username: string;
      password: string;
    }
  | {
      scope: 'user';
      token: string;
    };

type Response<T> =
  | {
      ok: true;
      result: T;
      time: string;
      count: number;
    }
  | {
      ok: false;
      error: string;
      time: string;
    };

type SchemaResults<TSchemas extends z.ZodTypeAny[]> = {
  [Index in keyof TSchemas]: Response<z.infer<TSchemas[Index]>>;
};

type SurQL = {
  query: string;
  params: Record<string, string>;
};

export const surql = (strings: TemplateStringsArray, ...args: unknown[]): SurQL => {
  let query = strings[0];
  const params: Record<string, string> = {};
  args.forEach((value, i) => {
    const paramName = `_${i}`;
    // query += `$${paramName}` + strings[i + 1];
    query = query.concat('$', paramName, strings[i + 1]);
    params[paramName] = JSON.stringify(value);
  });
  // console.log({ query, params });
  return { query, params };
};

export class Surreal {
  private authorization = '';

  constructor(auth: Auth) {
    switch (auth.scope) {
      case 'root':
        this.authorization =
          'Basic ' + Buffer.from(`${auth.username}:${auth.password}`, 'utf-8').toString('base64');
        break;

      case 'user':
        this.authorization = `Bearer ${auth.token}`;
        break;
    }
  }

  private async request(
    sql: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<RestResponse<unknown | null>[] | RestResponseError> {
    const url = new URL(`${PUBLIC_SURREAL_HOST}/sql`);
    if (params)
      Object.entries(params).forEach(([param, value]) => {
        url.searchParams.append(param, value.toString());
      });

    const response = await fetch(url, {
      method: 'post',
      headers: {
        NS: PUBLIC_SURREAL_NS,
        DB: PUBLIC_SURREAL_DB,
        Accept: 'application/json',
        'Content-Type': 'text/plain',
        Authorization: this.authorization,
      },
      body: sql,
    });
    return await response.json();
  }

  /**
   * Performs a query and parses each result using an array of Zod schemas
   */
  async query<TSchemas extends z.ZodTypeAny[]>(
    surql: SurQL,
    ...schemas: TSchemas
  ): Promise<SchemaResults<TSchemas>> {
    const responses = await this.request(surql.query, surql.params);

    // if (responses.length !== schemas.length)
    //   throw new Error('Number of Surreal responses and Zod schemas do not match');

    // RestResponseError
    if (!Array.isArray(responses)) {
      console.log(responses);
      throw new Error('SurrealDB error');
    }

    return responses.map(
      (response, i): Response<unknown[]> =>
        response.status === 'OK'
          ? {
              ok: true,
              result: schemas[i]?.parse(response.result) ?? response.result,
              time: response.time,
              count: Array.isArray(response.result)
                ? response.result.length
                : Boolean(response.result)
                ? 1
                : 0,
            }
          : { ok: false, error: response.detail, time: response.time },
    ) as any;
  }
}

export const connect = (token: string) => new Surreal({ scope: 'user', token });
