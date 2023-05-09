/// <reference types="lucia-auth" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import('lucia-auth').AuthRequest;
      surrealToken: string;
    }
    // interface PageData {}
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
