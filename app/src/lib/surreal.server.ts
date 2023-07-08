import { SURREAL_PASS, SURREAL_USER } from '$env/static/private';
import { Surreal, signIn } from '@snipswap/surreal';
import { surrealBaseConfig } from './surreal';

export const connectRoot = () =>
  new Surreal({ scope: 'root', username: SURREAL_USER, password: SURREAL_PASS }, surrealBaseConfig);

export function getUserToken(sessionId: string) {
  return signIn({ scope: 'user', sessionId }, surrealBaseConfig);
}
export function getPublicToken() {
  return signIn({ scope: 'public' }, surrealBaseConfig);
}
