import { SURREAL_PASS, SURREAL_USER } from '$env/static/private';
import { PUBLIC_SURREAL_DB, PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS } from '$env/static/public';
import { Surreal } from '$lib/db/surreal';

type TokenResponse =
  | {
      code: 200;
      token: string;
    }
  | {
      code: 403;
    };

type Signin =
  | {
      scope: 'user';
      sessionId: string;
    }
  | {
      scope: 'public';
    };

export const connectRoot = () =>
  new Surreal({ scope: 'root', username: SURREAL_USER, password: SURREAL_PASS });

const signIn = async (signin: Signin) => {
  const { scope, ...params } = signin;
  const url = new URL(`${PUBLIC_SURREAL_HOST}/signin`);

  const response = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NS: PUBLIC_SURREAL_NS,
      DB: PUBLIC_SURREAL_DB,
      SC: scope,
      ...params,
    }),
  });
  const data: TokenResponse = await response.json();
  return data.code === 200 ? data.token : null;
};

export const getUserToken = (sessionId: string) => signIn({ scope: 'user', sessionId });
export const getPublicToken = () => signIn({ scope: 'public' });
