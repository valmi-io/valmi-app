/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 9:37:18 am
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import { createStrategy } from '@/pagesapi/oauth2/login/google';
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
        provider: user?.provider ?? 'google',
        access_token: user['_accessToken'],
        refresh_token: user?._refreshToken ?? '',
        id: user.id,
        email: user.emails[0].value,
        name: user.displayName,
        image: user.photos[0].value,
        unique_id: user.emails[0].value
      });

      res.redirect('/auth/callback?' + params.toString());
    })(req, res, next);
  });

export default router.handler();
