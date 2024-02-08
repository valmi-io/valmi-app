/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 19th 2023, 12:30:22 pm
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';

import passport from 'passport';

import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { oauthKeys } from '@/lib/oauth_middleware';

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user: Profile) => {
  return new Promise((resolve, reject) => {
    resolve('Successful');
  });
};

export const createStrategy = ({
  client_id = '',
  client_secret = '',
  workspace = '',
  connector = '',
  oauth_keys = 'private'
}) => {
  const strategy = new GoogleStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/google?workspace=${workspace}&connector=${connector}&oauth_keys=${oauth_keys}` // this is the endpoint you registered on hubspot while creating your app. This endpoint would exist on your application for verifying the authentication
    },
    async (_accessToken, _refreshToken, profile: any, cb: any) => {
      try {
        profile['_accessToken'] = _accessToken;
        profile['_refreshToken'] = _refreshToken;
        await saveUser(profile);
        return cb(null, profile);
      } catch (e: any) {
        throw new Error(e);
      }
    }
  );

  return strategy;
};

const router = createRouter();

router
  .use(oauthKeys)

  .get(async (req, res, next) => {
    let { workspace = '', connector = '', oauth_keys = 'private' } = req.query;

    let credentials = { ...(req.credentials ?? {}) };

    if (oauth_keys === 'public') {
      credentials = {
        client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET
      };
    }

    const query = { ...credentials, workspace: workspace, connector: connector, oauth_keys: oauth_keys };

    const strategy = createStrategy(query);

    return passport.authenticate(strategy, {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/adwords'
      ],
      session: false,
      accessType: 'offline',
      prompt: 'consent'
    })(req, res, next);
  });

export default router.handler();
