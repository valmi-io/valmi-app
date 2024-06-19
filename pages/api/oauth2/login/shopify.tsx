/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 30th 2024, 12:05:04 am
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import passport from 'passport';

import { Strategy as ShopifyStrategy } from '@lib/passport-shopify/index';

import { oauthKeys } from '@/lib/oauth_middleware';

export const createStrategy = ({ client_id = '', client_secret = '', shop = '' }) => {
  const strategy = new ShopifyStrategy(
    {
      clientID: client_id as string,
      clientSecret: client_secret as string,
      shop: shop as string,
      callbackURL: `http://localhost:3000/api/oauth2/redirect/shopify` // this is the endpoint you registered on shopify while creating your app. This endpoint would exist on your application for verifying the authentication
    },
    async (accessToken, refreshToken, profile: any, cb: any) => {
      try {
        profile['_accessToken'] = accessToken;
        profile['_refreshToken'] = refreshToken;

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

    let { workspace = '', connector = '', oauth_keys = 'private', meta: { shop = '', scope = [] } = {} } = json;

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

    const params = {
      workspace: workspace,
      connector: connector,
      oauth_keys: oauth_keys,
      shop: shop
    };

    passport.authenticate(strategy, {
      scope: scope,
      session: false,
      state: encodeURIComponent(JSON.stringify(params))
    })(req, res, next);
  });

export default router.handler();
