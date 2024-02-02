//@ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 30th 2024, 11:47:14 am
 * Author: Nagendra S @ valmi.io
 */

import { createRouter } from 'next-connect';

import passport from 'passport';

import { Strategy as SlackStrategy } from '@lib/passport-slack/index';
import { oauthKeys } from '@/lib/oauth_middleware';

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    resolve('Successful');
  });
};

export const createStrategy = ({ client_id = '', client_secret = '', workspace = '', connector = '' }) => {
  const strategy = new SlackStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      user_scope: ['identity.basic', 'identity.email'],
      scope: ['users.profile:read', 'chat:write', 'channels:read', 'channels:join'], // default,
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/slack?workspace=${workspace}&connector=${connector}`
    },
    async (accessToken, params, profile, cb: any) => {
      try {
        profile['_accessToken'] = accessToken;
        profile['_refreshToken'] = null;
        profile['_bot_user_id'] = params.bot_user_id;
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

router.use(oauthKeys).get(async (req, res, next) => {
  let { workspace = '', connector = '' } = req.query;
  const query = { ...req.credentials, workspace: workspace, connector };
  const strategy = createStrategy(query);

  return passport.authenticate(strategy, null, {
    failureRedirect: '/login', // Redirect to login page on failure
    successRedirect: '/' //
  })(req, res, next);
});

export default router.handler();
