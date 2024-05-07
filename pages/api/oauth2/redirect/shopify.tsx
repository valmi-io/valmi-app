/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 30th 2024, 12:12:13 am
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import { createStrategy } from '@/pagesapi/oauth2/login/shopify';
import passport from 'passport';
import { oauthKeys } from '@/lib/oauth_middleware';

const router = createRouter();

router
  .use(oauthKeys)

  .get(async (req, res, next) => {
    const { state = '' } = req.query;

    let json = JSON.parse(decodeURIComponent(state));

    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    let { oauth_keys = 'private', shop = '' } = json;

    let credentials = {};
    let query_response = { ...(req.credentials ?? {}) };

    if (oauth_keys === 'public') {
      credentials = {
        client_id: process.env.AUTH_SHOPIFY_CLIENT_ID,
        client_secret: process.env.AUTH_SHOPIFY_CLIENT_SECRET
      };
    } else {
      credentials = {
        client_id: query_response['AUTH_SHOPIFY_CLIENT_ID'],
        client_secret: query_response['AUTH_SHOPIFY_CLIENT_SECRET']
      };
    }

    credentials['shop'] = shop;

    const query = { ...credentials };

    const strategy = createStrategy(query);

    console.log('--------------------------------         authenticating again:_ --------------------');
    passport.authenticate(strategy, { session: 'false' }, async (err: any, user: any) => {
      console.log('================== redirect callback =======================', user);
      const params = new URLSearchParams({
        provider: user?.provider ?? 'shopify',
        access_token: user?._accessToken ?? '',
        refresh_token: user?._refreshToken ?? '',
        id: user.id,
        email: user.emails[0].value,
        name: user.displayName,
        image: '',
        unique_id: user.emails[0].value
      });

      return res.redirect('/auth/callback?' + params.toString());
    })(req, res, next);
  });

export default router.handler();
