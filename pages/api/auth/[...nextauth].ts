import { generateAuthenticationPayload } from '@/content/Authentication/AuthenticationFormUtils';
import { getCookie, setCookie } from '@/lib/cookies';
import { getBaseUrl } from '@/pagesapi/utils';
import { signOutUser } from '@/utils/lib';
import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

export default NextAuth({
  providers: [
    GoogleProviders({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
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
        payload = generateAuthenticationPayload(payload);
        try {
          const response = await axios.post('http://localhost:4000/api/auth/social/login', payload);
          const { auth_token } = response.data;
          let cookieObj = {
            auth_token
          };
          const result = await setCookie('AUTH', JSON.stringify(cookieObj), {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            // sameSite: 'none',
            path: '/login'
          });
          console.log('resultr response:', result);
          // const accessToken = (await getCookie('AUTH')?.accessToken) ?? '';

          // let res = NextResponse.next();
          // res.cookies.set('AUTH', JSON.stringify(cookieObj));

          const spacesResponse = await axios.get('http://localhost:4000/api/v1/spaces', {
            headers: {
              Authorization: `Bearer ${auth_token}`
            }
          });

          // if (spacesResponse.status === 200) {
          //   return spacesResponse.data && { data: spacesResponse.data };
          // } else if (spacesResponse?.error?.data?.detail === 'Unauthorized') {
          //   // check if "AUTH" cookie exists and kill it
          //   // signOutUser();
          // }
        } catch (error) {
          console.log('error:', error);
        }
      }
    }
    // async redirect({ url, baseUrl }) {
    //   console.log('url:', url);
    //   console.log('baseUrl:', baseUrl);
    //   return 'http://localhost:3000';
    // },
  }
});
