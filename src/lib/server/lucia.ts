import { dev } from '$app/environment';
import { github } from '@lucia-auth/oauth/providers';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { surrealdb } from './surreal-adapter';

export const auth = lucia({
  adapter: surrealdb(),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  transformDatabaseUser: (userData) => ({
    userId: userData.id,
  }),
});
export type Auth = typeof auth;

export const githubAuth = github(auth, {
  clientId: '',
  clientSecret: '',
});
