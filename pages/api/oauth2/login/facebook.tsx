/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { oauthKeys } from '@/lib/oauth_middleware';

export const createStrategy = ({ client_id = '', client_secret = '' }) => {
  const strategy = new FacebookStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      authType: 'reauthenticate',
      profileFields: ['id', 'displayName', 'photos', 'email'],
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/facebook` // this is the endpoint you registered on hubspot while creating your app. This endpoint would exist on your application for verifying the authentication
    },
    async (_accessToken, _refreshToken, profile: any, cb: any) => {
      try {
        profile['_accessToken'] = _accessToken;
        profile['_refreshToken'] = _refreshToken;
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
    const { state = '' } = req.query;

    let json = JSON.parse(decodeURIComponent(state));

    let { workspace = '', connector = '', oauth_keys = 'private' } = json;

    let credentials = {};
    let query_response = { ...(req.credentials ?? {}) };

    if (oauth_keys === 'public') {
      credentials = {
        client_id: process.env.AUTH_FACEBOOK_CLIENT_ID,
        client_secret: process.env.AUTH_FACEBOOK_CLIENT_SECRET
      };
    } else {
      credentials = {
        client_id: query_response['AUTH_FACEBOOK_CLIENT_ID'],
        client_secret: query_response['AUTH_FACEBOOK_CLIENT_SECRET']
      };
    }

    const query = { ...credentials };
    const strategy = createStrategy(query);

    const params = {
      workspace: workspace,
      connector: connector,
      oauth_keys: oauth_keys
    };

    return passport.authenticate(strategy, {
      scope: ['public_profile', 'ads_management', 'email'],
      session: false,
      state: encodeURIComponent(JSON.stringify(params))
    })(req, res, next);
  });

export default router.handler();
