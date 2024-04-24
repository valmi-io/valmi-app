import { generateAuthenticationPayload } from '@/content/Authentication/AuthenticationFormUtils';
import { getOauthRoute } from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { getBaseUrl } from '@/pagesapi/utils';
import axios from 'axios';
import NextAuth, { getServerSession } from 'next-auth';

import GoogleProviders from 'next-auth/providers/google';
import { redirect } from 'next/navigation';

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
  // session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // this session lasts 30 days
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('im in signin');
      const session = await getServerSession();
      if (session) {
        redirect('/');
      }
      console.log('ACCOUNUT:', account);
      console.log('USER:', user);
      if (account?.provider === 'google' && profile?.email) {
        // const { accessToken, idToken } = account;
        // let values = {
        //   email: profile?.email,
        //   password: accessToken
        //   // id_token: idToken
        // };
        // const payload = generateAuthenticationPayload(values);
        // try {
        // } catch (error) {
        //   console.log('error:', error);
        // }
      }
    }

    // async jwt({ token, account, user }) {
    //   if (user) {
    //     if (user) {
    //       token.accessToken = account.access_token;
    //       token.id = user.id;
    //     }
    //     return token;
    //     const res = await fetch(`${getBaseUrl()}/auth/login`, {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${account?.id_token}`
    //       }
    //     });
    //     const resParsed = await res.json();
    //     token = Object.assign({}, token, {
    //       id_token: account.id_token
    //     });
    //     token = Object.assign({}, token, {
    //       myToken: resParsed.authToken
    //     });
    //   }

    //   return token;
    // },
  }
});
