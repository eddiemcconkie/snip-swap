import axios, { AxiosInstance } from 'axios';
import type { z } from 'zod';

type RestResponse<T = unknown> =
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

export type Response<T> =
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

export class SurQL {
  constructor(readonly query: string, readonly params: Record<string, string>) {}
}

export function surql(strings: TemplateStringsArray, ...args: unknown[]): SurQL {
  let query = strings[0]!;
  let params: Record<string, string> = {};
  args.forEach((value, i) => {
    if (value instanceof SurQL) {
      query = query.concat(value.query, strings[i + 1]!);
      params = { ...params, ...value.params };
    } else {
      const id = crypto.randomUUID().replaceAll('-', '').slice(0, 6);
      const paramName = `_${id}`;
      query = query.concat('$', paramName, strings[i + 1]!);
      params[paramName] = JSON.stringify(value);
    }
  });
  return new SurQL(query, params);
}

export class Surreal {
  private instance: AxiosInstance;

  constructor(auth: Auth, config: SurrealConfig) {
    this.instance =
      auth.scope === 'root'
        ? rootInstance({
            ...config,
            username: auth.username,
            password: auth.password,
          })
        : tokenInstance({
            ...config,
            token: auth.token,
          });
  }

  private async request(sql: string, params?: Record<string, string | number | boolean>) {
    const response = await this.instance.post<RestResponse[] | RestResponseError>('/sql', sql, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain',
      },
      params,
    });
    return response.data;
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

  async queryDebug(...args: Parameters<typeof this.query>): ReturnType<typeof this.query> {
    const [surql, ...schemas] = args;
    console.group('DEBUG');
    for (const line of surql.query.split('\n')) {
      console.log(line);
    }
    console.log();
    console.log('params:', surql.params);
    console.log();
    console.groupEnd();

    return await this.query(...args);
  }
}

type TokenResponse =
  | {
      code: 200;
      token: string;
    }
  | {
      code: 403;
    };

type Signin =
  | {
      scope: 'user';
      sessionId: string;
    }
  | {
      scope: 'public';
    }
  | {
      scope: 'extension';
      apiKey: string;
    };

export async function signIn(signin: Signin, config: SurrealConfig) {
  const instance = tokenInstance(config);
  const { scope, ...params } = signin;

  const response = await instance.post<TokenResponse>(
    '/signin',
    JSON.stringify({
      NS: config.ns,
      DB: config.db,
      SC: scope,
      ...params,
    }),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const { data } = response;
  return data.code === 200 ? data.token : null;
}

export type SurrealConfig = {
  host: string;
  ns: string;
  db: string;
};
export type SurrealRootConfig = SurrealConfig & {
  username: string;
  password: string;
};
export type SurrealTokenConfig = SurrealConfig & {
  token?: string;
};

export function rootInstance(config: SurrealRootConfig) {
  return axios.create({
    baseURL: config.host,
    auth: {
      username: config.username,
      password: config.password,
    },
    headers: {
      NS: config.ns,
      DB: config.db,
    },
  });
}

export function tokenInstance(config: SurrealTokenConfig) {
  return axios.create({
    baseURL: config.host,
    headers: {
      NS: config.ns,
      DB: config.db,
      Authorization: config.token ? `Bearer ${config.token}` : undefined,
    },
  });
}
