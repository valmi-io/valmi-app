/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 5:27:00 pm
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck
import { createRouter } from 'next-connect';

import passport from 'passport';

import { Profile, Strategy as HubspotStrategy } from 'passport-hubspot-auth';
import { oauthKeys } from '@/lib/oauth_middleware';

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user: Profile) => {
  return new Promise((resolve, reject) => {
    resolve('Successful');
  });
};

export const createStrategy = ({ client_id = '', client_secret = '', workspace = '', connector = '' }) => {
  const strategy = new HubspotStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      user_scope: ['identity.basic', 'identity.email'],
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/hubspot?workspace=${workspace}&connector=${connector}`, // this is the endpoint you registered on hubspot while creating your app. This endpoint would exist on your application for verifying the authentication
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, profile, cb: any) => {
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

router.use(oauthKeys).get(async (req, res, next) => {
  let { workspace = '', connector = '' } = req.query;
  const query = { ...req.credentials, workspace: workspace, connector };
  const strategy = createStrategy(query);

  return passport.authenticate(strategy, {
    scope: [
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write'
    ]
  })(req, res, next);
});

export default router.handler();
