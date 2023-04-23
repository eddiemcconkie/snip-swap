import type { Adapter, LuciaErrorConstructor } from 'lucia-auth';

export const surrealdb =
  () =>
  (luciaError: LuciaErrorConstructor): Adapter => ({
    getSessionAndUserBySessionId: async (sessionId) => {
      return {
        user: {
          id: 'user:eddie',
          role: 'user',
        },
        session: {
          id: 'session:1',
          user_id: 'user:eddie',
          active_expires: 5,
          idle_expires: 5,
        },
      };
    },
    getSession: async (sessionId) => {
      return {
        id: 'session:1',
        user_id: 'user:eddie',
        active_expires: 5,
        idle_expires: 5,
      };
    },
    getSessionsByUserId: async (userId) => {
      return [
        {
          id: 'session:1',
          user_id: 'user:eddie',
          active_expires: 5,
          idle_expires: 5,
        },
      ];
    },
    setSession: async (session) => {},
    deleteSession: async (sessionId) => {},
    deleteSessionsByUserId: async (userId) => {},
    getUser: async (userId) => {
      return {
        id: 'user:eddie',
        role: 'user',
      };
    },
    setUser: async (userId, userAttributes, key) => {
      return {
        id: 'user:eddie',
        role: 'user',
      };
    },
    deleteUser: async (userId) => {},
    updateUserAttributes: async (userId, attributes) => {
      return {
        id: 'user:eddie',
        role: 'user',
      };
    },
    setKey: async (key) => {},
    deleteNonPrimaryKey: async (key) => {},
    deleteKeysByUserId: async (userId) => {},
    updateKeyPassword: async (key, hashedPassword) => {},
    getKey: async (keyId, shouldDataBeDeleted) => {
      return {
        id: 'key:1',
        hashed_password: '12345',
        primary_key: true,
        user_id: 'user:eddie',
        expires: null,
      };
    },
    getKeysByUserId: async (userId) => {
      return [
        {
          id: 'key:1',
          hashed_password: '12345',
          primary_key: true,
          user_id: 'user:eddie',
          expires: null,
        },
      ];
    },
  });
