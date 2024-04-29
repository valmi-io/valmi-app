// @ts-nocheck
import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code'
  });

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
        if (account) {
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

              // console.log('jwt payload:_', payload);

              await handleSocialLogin(
                payload,
                (data) => {
                  console.log('social login response: ', data);
                  const { auth_token, workspace_id } = data ?? {};

                  token.apiToken = auth_token;
                  token.workspaceId = workspace_id ?? '';
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
        }

        return token;
      },
      async session({ token, session }) {
        session.apiToken = token.apiToken;
        session.workspaceId = token.workspaceId;
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
