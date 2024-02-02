/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 5:24:52 pm
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import { createStrategy } from '@/pagesapi/oauth2/login/hubspot';
import passport from 'passport';
import { oauthKeys } from '@/lib/oauth_middleware';

const router = createRouter();

router
  .use(oauthKeys)

  .get(async (req, res, next) => {
    let { workspace = '', connector = '' } = req.query;
    const query = { ...req.credentials, workspace: workspace, connector };
    const strategy = createStrategy(query);

    return passport.authenticate(strategy, { session: 'false' }, async (err: any, user: any) => {
      const params = new URLSearchParams({
        provider: user?.provider ?? 'hubspot',
        access_token: user['_accessToken'],
        refresh_token: user?._refreshToken ?? '',
        id: user.user_id,
        unique_id: user.user,
        hub_id: user['hub_id'],
        email: user.user,
        name: user.user.split('@')[0],
        image: ''
      });

      res.redirect('/auth/callback?' + params.toString());
    })(req, res, next);
  });

export default router.handler();
