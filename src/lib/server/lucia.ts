import { dev } from '$app/environment';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { github } from '@lucia-auth/oauth/providers';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { surrealdb } from './surreal-adapter';

export const auth = lucia({
  adapter: surrealdb(),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  autoDatabaseCleanup: true,
  transformDatabaseUser(userData) {
    return userData;
  },
  experimental: {
    debugMode: true,
  },
});
export type Auth = typeof auth;

export const githubAuth = github(auth, {
  clientId: GITHUB_ID,
  clientSecret: GITHUB_SECRET,
});
