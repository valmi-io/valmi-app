// @ts-nocheck
import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';

import Cookies from 'cookies';
import { getAuthTokenCookie } from '@/lib/cookies';

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code'
  });

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  console.log('refreshing access token:_', token);
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
        client_secret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

export const nextAuthOptions = (req, res) => {
  return {
    providers: [
      GoogleProviders({
        clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope:
              'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets'
          }
        }
      })
    ],

    authorizationUrl: GOOGLE_AUTHORIZATION_URL,
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // this session lasts 7 days
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login'
    },
    callbacks: {
      async jwt({ token, trigger, account, profile, user, session }) {
        // console.log('jwt callback', {
        //   token,
        //   trigger,
        //   account,
        //   profile,
        //   user,
        //   session
        // });
        // Initial sign in

        if (account && user) {
          let workspaceId = '';
          if (account.provider === 'google') {
            try {
              const { access_token, id_token, provider, type, expires_at, refresh_token, scope, token_type } = account;
              const { name, email } = token;

              let payload = {
                account: {
                  provider: provider,
                  type: type,
                  access_token: access_token,
                  expires_at: expires_at,
                  refresh_token: refresh_token,
                  scope: scope,
                  token_type: token_type,
                  id_token: id_token
                },
                user: {
                  name: name,
                  email: email
                }
              };

              await handleSocialLogin(
                payload,
                (data) => {
                  const { auth_token, workspace_id } = data ?? {};

                  const cookieObj = {
                    accessToken: auth_token
                  };

                  const cookies = new Cookies(req, res);

                  const auth = cookies.get(getAuthTokenCookie());

                  if (!auth) {
                    cookies.set(getAuthTokenCookie(), JSON.stringify(cookieObj), {
                      path: '/',
                      httpOnly: false
                    });
                  }

                  workspaceId = workspace_id ?? '';

                  // token.workspaceId = workspace_id ?? '';
                },
                (error) => {
                  throw error;
                  // token.error = err;
                }
              );
            } catch (error) {
              // token.error = err;
              throw error;
            }
          }
          return {
            accessToken: account.accessToken,
            accessTokenExpires: Date.now() + account.expires_in * 1000,
            refreshToken: account.refresh_token,
            workspaceId: workspaceId ?? '',
            user
          };
        }

        // Return previous token if the access token has not expired yet
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }

        // Access token has expired, try to update it
        return await refreshAccessToken(token);
      },
      async session({ token, session }) {
        if (token) {
          session.user = token.user;
          session.accessToken = token.accessToken;
          session.error = token.error;
          session.workspaceId = token.workspaceId;
        }

        return session;
      }
    }
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

const handleSocialLogin = async (payload, successCb, errorCb) => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/social/login', payload);

    const result = response?.data ?? {};
    if (hasErrorsInData(result)) {
      const traceError = getErrorsInData(result);
      errorCb(traceError);
    } else {
      successCb(result);
    }
  } catch (err) {
    const errors = getErrorsInErrorObject(error);
    const { message = '' } = errors || {};
    errorCb(message);
  }
};
