import { surql } from '$lib/db/surreal';
import { keySchema, sessionSchema, userSchema, type UserSchema } from '$lib/schema/auth';
import { addTable } from '$lib/schema/id';
import type { Adapter, LuciaErrorConstructor } from 'lucia-auth';
import { z } from 'zod';
import { connectRoot } from '../db/surreal.server';

export const surrealdb =
  () =>
  (LuciaError: LuciaErrorConstructor): Adapter => ({
    getSessionAndUserBySessionId: async (sessionId) => {
      sessionId = addTable('auth_session', sessionId);
      // console.log('getSessionAndUserBySessionId', sessionId);
      const db = connectRoot();
      const [sessionAndUser] = await db.query(
        surql`SELECT 
                *, 
                user_id.* AS user
              FROM type::thing(${sessionId})`,
        sessionSchema.merge(z.object({ user: userSchema })).array(),
      );
      if (sessionAndUser.ok && sessionAndUser.count === 1) {
        const { user, ...session } = sessionAndUser.result[0];
        // console.log('returns:', user, session);
        return {
          user,
          session,
        };
      }
      return null;
    },
    getSession: async (sessionId) => {
      sessionId = addTable('auth_session', sessionId);
      // console.log('getSession', sessionId);
      const db = connectRoot();
      const [session] = await db.query(
        surql`SELECT * FROM type::thing(${sessionId})`,
        sessionSchema.array(),
      );
      // console.log('returns:', session.ok && session?.result?.[0]);
      if (session.ok && session.count === 1) return session.result[0];
      return null;
    },
    getSessionsByUserId: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('getSessionsByUserId', userId);
      const db = connectRoot();
      const [sessions] = await db.query(
        surql`SELECT *
              FROM auth_session
              WHERE user_id = type::thing(${userId})`,
        sessionSchema.array(),
      );
      // console.log('returns:', sessions.ok && sessions?.result);
      if (sessions.ok) return sessions.result;
      return [];
    },
    setSession: async (session) => {
      const encodedSession = {
        ...session,
        id: addTable('auth_session', session.id),
        user_id: addTable('auth_user', session.user_id),
      };
      // console.log('setSession', encodedSession);
      const db = connectRoot();
      const [newSession] = await db.query(
        surql`CREATE auth_session CONTENT ${encodedSession}`,
        sessionSchema.array(),
      );
      // console.log('creates new session:', newSession.ok && newSession.result);
      if (!newSession.ok) throw new LuciaError('AUTH_INVALID_SESSION_ID', newSession.error);
    },
    deleteSession: async (sessionId) => {
      sessionId = addTable('auth_session', sessionId);
      // console.log('deleteSession', sessionId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${sessionId})`);
    },
    deleteSessionsByUserId: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('deleteSessionsByUserId', userId);
      const db = connectRoot();
      await db.query(surql`DELETE auth_session WHERE user_id = type::thing(${userId})`);
    },
    getUser: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('getUser', userId);
      const db = connectRoot();
      const [user] = await db.query(
        surql`SELECT * FROM type::thing(${userId})`,
        userSchema.array(),
      );
      // console.log('returns:', user.ok && user?.result?.[0]);
      if (user.ok && user.count === 1) return user.result[0];
      return null;
    },
    setUser: async (userId, userAttributes, key) => {
      userId = addTable('auth_user', userId);
      // console.log('setUser', userId, userAttributes, key);
      const db = connectRoot();
      let duplicateKey = false;
      if (key) {
        const encodedKey = {
          ...key,
          id: addTable('auth_key', key.id),
          user_id: userId,
        };
        const [newUser, newKey] = await db.query(
          surql`
            BEGIN;
            CREATE type::thing(${userId}) CONTENT ${userAttributes};
            CREATE auth_key CONTENT ${encodedKey}; 
            COMMIT;
          `,
          userSchema.array(),
          keySchema.array(),
        );
        if (!newKey.ok) duplicateKey = true;
        else if (newUser.ok && newUser.count === 1) return newUser.result[0];
      } else {
        const [newUser] = await db.query(
          surql`CREATE type::thing(${userId}) CONTENT ${userAttributes}`,
          userSchema.array(),
        );
        if (newUser.ok && newUser.count === 1) return newUser.result[0];
      }
      if (duplicateKey) throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
      // Dumb, but the type function expects you to return an id
      // but the docs say it should return void if the user can't be created
      return undefined as unknown as UserSchema;
    },
    deleteUser: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('deleteUser', userId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${userId})`);
    },
    updateUserAttributes: async (userId, attributes) => {
      userId = addTable('auth_user', userId);
      // console.log('updateUserAttributes', userId, attributes);
      const db = connectRoot();
      const [updatedUser] = await db.query(
        surql`UPDATE type::thing(${userId}) MERGE ${attributes}`,
        userSchema.array(),
      );
      if (updatedUser.ok && updatedUser.count === 1) return updatedUser.result[0];
    },
    setKey: async (key) => {
      const encodedKey = {
        ...key,
        id: addTable('auth_key', key.id),
        user_id: addTable('auth_key', key.user_id),
      };
      // console.log('setKey', encodedKey);
      const db = connectRoot();
      const [newKey] = await db.query(
        surql`CREATE auth_key CONTENT ${encodedKey}`,
        keySchema.array(),
      );
      if (!newKey.ok) throw new LuciaError('AUTH_INVALID_KEY_ID');
    },
    deleteNonPrimaryKey: async (keyId) => {
      keyId = addTable('auth_key', keyId);
      // console.log('deleteNonPrimaryKey', keyId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${keyId}) WHERE primary_key != true`);
    },
    deleteKeysByUserId: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('deleteKeysByUserId', userId);
      const db = connectRoot();
      await db.query(surql`DELETE auth_key WHERE user_id = type::thing(${userId})`);
    },
    updateKeyPassword: async (keyId, hashedPassword) => {
      keyId = addTable('auth_key', keyId);
      // console.log('updateKeyPassword', keyId, hashedPassword);
      const db = connectRoot();
      const [updatedKey] = await db.query(
        surql`UPDATE type::thing(${keyId}) SET hashed_password = type::string(${hashedPassword})`,
        keySchema.array(),
      );
      if (updatedKey.ok && updatedKey.count === 1) return updatedKey.result[0];
    },
    getKey: async (keyId, shouldDataBeDeleted) => {
      keyId = addTable('auth_key', keyId);
      // console.log('getKey', keyId);
      const db = connectRoot();
      const [key] = await db.query(surql`SELECT * FROM type::thing(${keyId})`, keySchema.array());

      if (key.ok && key.count === 1) {
        if (await shouldDataBeDeleted(key.result[0]))
          await db.query(surql`DELETE type::thing(${keyId})`);
        // console.log('returns:', key.result[0]);
        return key.result[0];
      }
      return null;
    },
    getKeysByUserId: async (userId) => {
      userId = addTable('auth_user', userId);
      // console.log('getKeysByUserId', userId);
      const db = connectRoot();
      const [keys] = await db.query(
        surql`SELECT * FROM auth_key WHERE user_id = type::thing(${userId})`,
        keySchema.array(),
      );
      if (keys.ok) return keys.result;
      return [];
    },
  });
