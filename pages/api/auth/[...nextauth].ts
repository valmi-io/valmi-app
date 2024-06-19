// @ts-nocheck
import axios from 'axios';
import NextAuth, { User } from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';

import { getErrorsInData, handleAxiosError, hasErrorsInData } from '@/components/Error/ErrorUtils';
import { isObjectEmpty } from '@/utils/lib';
import { getAuthMetaCookie } from '@/lib/cookies';
import { getBaseUrl } from '@/pagesapi/utils';

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
  console.log('refreshing access token:.........');
  console.log('[refreshAccessToken]: old token: ', token.access_token);
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

    const responseTokens = await response.json();

    if (!response.ok) {
      throw responseTokens;
    }

    console.log('[refreshAccessToken]: new token: ', responseTokens.access_token);

    return {
      // Keep the previous token properties
      ...token,
      access_token: responseTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + (responseTokens.expires_in as number)),
      // Fall back to old refresh token, but note that
      // many providers may only allow using a refresh token once.
      refresh_token: responseTokens.refresh_token ?? token.refresh_token
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError' as const
    };
  }
}

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets'
];

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
            scope: SCOPES.join(' ')
          }
        }
      })
    ],

    authorizationUrl: GOOGLE_AUTHORIZATION_URL,
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // this session lasts 7 days
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
      error: '/login'
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // we are currently not allowing sign-ins from google accounts that have not been verified google.
        if (account && account.provider === 'google' && profile && 'email_verified' in profile) {
          if (!profile.email_verified) return false;
        }
        return true;
      },
      async jwt({ token, trigger, account, profile, user, session }) {
        // Initial sign in

        if (account && user) {
          if (account.provider === 'google') {
            // First login, save the `access_token`, `refresh_token`, and other
            // details into the JWT

            const userProfile: User = {
              id: token.sub,
              name: profile?.name,
              email: profile?.email,
              image: token?.picture
            };

            let authMeta = getAuthMetaCookieFromReq(req);

            console.log('[next-auth] authMeta:_', authMeta);

            let payload = {
              account: {
                provider: account.provider,
                type: account.type,
                access_token: account.access_token,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                scope: account.scope,
                token_type: account.token_type,
                id_token: account.id_token
              },
              user: {
                name: token.name,
                email: token.email,
                meta: {
                  ...authMeta
                }
              }
            };

            await handleSocialLogin(
              payload,
              (data) => {
                const { auth_token, organizations = [] } = data ?? {};
                const workspaceId =
                  organizations.length > 0 ? organizations[0]?.organizations[0]?.workspaces[0]?.id : '';
                if (workspaceId) {
                }
                token.authToken = auth_token;
                token.workspaceId = workspaceId;
              },
              (error) => {
                console.log('[nextauth api backend error]', error);
                token.error = error;
                throw new Error(error);
              }
            );

            console.log('[VALID] - returning token');

            return {
              ...token,
              accessToken: account.access_token,
              expires_at: account.expires_at,
              refreshToken: account.refresh_token,
              user: userProfile
            };
          }
        } else if (Date.now() < token.expires_at * 1000) {
          console.log('[next-auth] - validating token.expired_at with current Date');
          console.log('[VALID TOKEN]');
          // Subsequent logins, if the `access_token` is still valid, return the JWT
          return token;
        }

        return await refreshAccessToken(token);
      },

      async session({ token, session }) {
        if (token?.error) {
          return { error: token.error };
        }

        return {
          ...session,
          ...token
        };
      }
    }
  };
};

const handler = (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

export default handler;

const handleSocialLogin = async (payload, successCb, errorCb) => {
  try {
    const response = await axios.post(`${getBaseUrl()}/auth/social/login`, payload);

    const result = response?.data ?? {};
    if (hasErrorsInData(result)) {
      const traceError = getErrorsInData(result);
      errorCb(traceError);
    } else {
      successCb(result);
    }
  } catch (error) {
    handleAxiosError(error, (err) => errorCb(err));
  }
};

function getAuthMetaCookieFromReq(req) {
  // Check for missing request object
  if (!req) {
    return {};
  }

  // Check for missing cookies
  const cookies = req?.cookies ?? {};
  if (isObjectEmpty(cookies)) {
    return {};
  }

  // Get the cookie name (assuming getAuthMetaCookie returns a string)
  const cookieName = getAuthMetaCookie();
  if (!cookieName) {
    return {};
  }

  // Try to retrieve the cookie and handle potential parsing errors
  const cookie = cookies[cookieName] ?? '{}'; // Use empty string as default
  try {
    const parsedCookie = JSON.parse(cookie);
    return parsedCookie?.meta ?? {}; // Extract and return meta property
  } catch (error) {
    return {};
  }
}
