/// <reference types="lucia-auth" />

import type { Surreal } from '$lib/db/surreal';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import('lucia-auth').AuthRequest;
      surrealToken: string;
      db: Surreal;
    }
    interface PageData {
      user: import('lucia-auth').User | null;
    }
    // interface Platform {}
  }
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type UserAttributes = {
      username: string;
      name: string;
      avatar: string;
      joined?: string;
    };
  }
}

export {};
