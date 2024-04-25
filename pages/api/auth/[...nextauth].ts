// @ts-nocheck
import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';

import Cookies from 'cookies';

const nextAuthOptions = (req, res) => {
  return {
   providers: [
    GoogleProviders({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/drive'
        }
      }
    })
  ],
  scope:
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly',
  authorizationUrl:
    'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // this session lasts 7 days
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (account?.provider === 'google' && profile?.email) {
          const { access_token, id_token, provider, type, expires_at, refresh_token, scope, token_type } = account;
          const { name, email } = profile;

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

          try {
            const response = await axios.post('http://localhost:4000/api/auth/social/login', payload);
            const { auth_token } = response.data;

            const cookieObj = {
              accessToken: auth_token
            };

            const cookies = new Cookies(req, res);

            const auth = cookies.get('AUTH');

            if (!auth) {
              cookies.set('AUTH', JSON.stringify(cookieObj), {
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
                httpOnly: false
              });

              try {
                const result = await axios.get('http://localhost:4000/api/v1/spaces', {
                  headers: {
                    Authorization: `Bearer ${auth_token}`
                  }
                });

                const workspaceID = result.data.organizations[0].workspaces[0].id;

                return `/login?wid=${workspaceID}`;
              } catch (error) {
                console.log('spaces error:', error);
                return '/login';
              }
            }
          } catch (error) {
            return '/login';
          }
        }
      }
    }
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};