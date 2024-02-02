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

export const createStrategy = ({ client_id = '', client_secret = '', workspace = '', connector = '' }) => {
  const strategy = new FacebookStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      authType: 'reauthenticate',
      profileFields: ['id', 'displayName', 'photos', 'email'],
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/facebook?workspace=${workspace}&connector=${connector}` // this is the endpoint you registered on hubspot while creating your app. This endpoint would exist on your application for verifying the authentication
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
    let { workspace = '', connector = '' } = req.query;
    const query = { ...req.credentials, workspace: workspace, connector };
    const strategy = createStrategy(query);

    return passport.authenticate(strategy, {
      scope: ['public_profile', 'ads_management', 'email'],
      session: false
    })(req, res, next);
  });

export default router.handler();
