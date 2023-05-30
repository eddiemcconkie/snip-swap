import { surql } from '$lib/db/surreal';
import { keySchema, sessionSchema, userSchema } from '$lib/schema/auth';
import { addTable } from '$lib/schema/id';
import type { Adapter, LuciaErrorConstructor } from 'lucia-auth';
import { z } from 'zod';
import { connectRoot } from '../db/surreal.server';

export const surrealdb =
  () =>
  (LuciaError: LuciaErrorConstructor): Adapter => ({
    /**
     * SESSION
     */
    async getSessionAndUserBySessionId(sessionId) {
      sessionId = addTable('auth_session', sessionId);
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
        return {
          user,
          session,
        };
      }
      return null;
    },

    async getSession(sessionId) {
      sessionId = addTable('auth_session', sessionId);
      const db = connectRoot();
      const [session] = await db.query(
        surql`SELECT * FROM type::thing(${sessionId})`,
        sessionSchema.array(),
      );
      if (session.ok && session.count === 1) {
        return session.result[0];
      }
      return null;
    },

    async getSessionsByUserId(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      const [sessions] = await db.query(
        surql`SELECT *
              FROM auth_session
              WHERE user_id = type::thing(${userId})`,
        sessionSchema.array(),
      );
      if (sessions.ok) {
        return sessions.result;
      }
      return [];
    },

    async setSession(session) {
      const encodedSession = {
        ...session,
        id: addTable('auth_session', session.id),
        user_id: addTable('auth_user', session.user_id),
      };
      const db = connectRoot();
      const [newSession] = await db.query(
        surql`CREATE auth_session CONTENT ${encodedSession}`,
        sessionSchema.array(),
      );
      if (!newSession.ok) {
        throw new LuciaError('AUTH_INVALID_SESSION_ID', newSession.error);
      }
    },

    async deleteSession(sessionId) {
      sessionId = addTable('auth_session', sessionId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${sessionId})`);
    },

    async deleteSessionsByUserId(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      await db.query(surql`DELETE auth_session WHERE user_id = type::thing(${userId})`);
    },

    /**
     * USER
     */
    async getUser(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      const [user] = await db.query(
        surql`SELECT * FROM type::thing(${userId})`,
        userSchema.array(),
      );
      if (user.ok && user.count === 1) {
        return user.result[0];
      }
      return null;
    },

    async setUser(userId, userAttributes, key) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
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
        if (!newKey.ok) {
          throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
        } else if (newUser.ok && newUser.count === 1) {
          return newUser.result[0];
        }
      } else {
        const [newUser] = await db.query(
          surql`CREATE type::thing(${userId}) CONTENT ${userAttributes}`,
          userSchema.array(),
        );
        if (newUser.ok && newUser.count === 1) {
          return newUser.result[0];
        }
      }
    },

    async updateUserAttributes(userId, attributes) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      const [updatedUser] = await db.query(
        surql`UPDATE type::thing(${userId}) MERGE ${attributes}`,
        userSchema.array(),
      );
      if (updatedUser.ok && updatedUser.count === 1) {
        return updatedUser.result[0];
      }
    },

    async deleteUser(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${userId})`);
    },

    /**
     * KEY
     */
    async getKey(keyId, shouldDataBeDeleted) {
      keyId = addTable('auth_key', keyId);
      const db = connectRoot();
      const [key] = await db.query(surql`SELECT * FROM type::thing(${keyId})`, keySchema.array());

      if (key.ok && key.count === 1) {
        if (await shouldDataBeDeleted(key.result[0])) {
          await db.query(surql`DELETE type::thing(${keyId})`);
        }
        return key.result[0];
      }
      return null;
    },

    async getKeysByUserId(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      const [keys] = await db.query(
        surql`SELECT * FROM auth_key WHERE user_id = type::thing(${userId})`,
        keySchema.array(),
      );
      if (keys.ok) {
        return keys.result;
      }
      return [];
    },

    async setKey(key) {
      const encodedKey = {
        ...key,
        id: addTable('auth_key', key.id),
        user_id: addTable('auth_key', key.user_id),
      };
      const db = connectRoot();
      const [newKey] = await db.query(
        surql`CREATE auth_key CONTENT ${encodedKey}`,
        keySchema.array(),
      );
      if (!newKey.ok) {
        throw new LuciaError('AUTH_INVALID_KEY_ID');
      }
    },

    async updateKeyPassword(keyId, hashedPassword) {
      keyId = addTable('auth_key', keyId);
      const db = connectRoot();
      const [updatedKey] = await db.query(
        surql`UPDATE type::thing(${keyId}) SET hashed_password = type::string(${hashedPassword})`,
        keySchema.array(),
      );
      if (updatedKey.ok && updatedKey.count === 1) {
        return updatedKey.result[0];
      }
    },

    async deleteNonPrimaryKey(keyId) {
      keyId = addTable('auth_key', keyId);
      const db = connectRoot();
      await db.query(surql`DELETE type::thing(${keyId}) WHERE primary_key != true`);
    },

    async deleteKeysByUserId(userId) {
      userId = addTable('auth_user', userId);
      const db = connectRoot();
      await db.query(surql`DELETE auth_key WHERE user_id = type::thing(${userId})`);
    },
  });
