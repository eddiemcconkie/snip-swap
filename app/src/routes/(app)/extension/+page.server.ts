import { connectRoot } from '$lib/surreal.server.js';
import { apiKeySchema } from '@snipswap/schema';
import { surql } from '@snipswap/surreal';
import { error } from '@sveltejs/kit';

export async function load({ locals: { auth, db } }) {
  const { user } = await auth.validateUser();
  if (!user) {
    return { user };
  }

  const [apiKeys] = await db.query(
    surql`SELECT * FROM api_key ORDER BY time.created DESC`,
    apiKeySchema.array(),
  );
  if (!apiKeys.ok) {
    throw error(500, apiKeys.error);
  }

  return {
    user,
    apiKeys: apiKeys.result,
  };
}

export const actions = {
  async generateApiKey({ locals: { auth } }) {
    const { user } = await auth.validateUser();
    if (!user) {
      throw error(401);
    }

    const db = connectRoot();
    const [prefix, ...rest] = crypto.randomUUID().split('-');
    const apiKey = `${prefix}.${rest.join('')}`;

    const [apiKeyResponse] = await db.query(
      surql`
        BEGIN TRANSACTION;

        LET $user = type::thing('auth_user', ${user.id});
        
        -- For now, only one API key is allowed
        DELETE api_key WHERE user_id = $user;

        LET $key = (CREATE api_key SET
          -- The key gets hashed automatically by the database
          hashed_key = type::string(${apiKey}),
          prefix = type::string(${prefix}),
          user_id = $user
        );

        RETURN (SELECT * FROM $key)[0];
        
        COMMIT TRANSACTION;
      `,
      apiKeySchema,
    );

    if (!apiKeyResponse.ok) {
      throw error(500, apiKeyResponse.error);
    }
    if (apiKeyResponse.count !== 1) {
      throw error(500, 'could not generate API key');
    }

    return { apiKey: { ...apiKeyResponse.result, value: apiKey } };
  },
};
