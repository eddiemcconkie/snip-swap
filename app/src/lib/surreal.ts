import { PUBLIC_SURREAL_DB, PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS } from '$env/static/public';
import { Surreal } from '@snipswap/surreal';

export const surrealBaseConfig = {
  host: PUBLIC_SURREAL_HOST,
  ns: PUBLIC_SURREAL_NS,
  db: PUBLIC_SURREAL_DB,
} as const;

export const connect = (token: string) => new Surreal({ scope: 'user', token }, surrealBaseConfig);
