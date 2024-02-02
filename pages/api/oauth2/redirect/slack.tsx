/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 12:42:28 pm
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import { createRouter } from 'next-connect';
import { createStrategy } from '@/pagesapi/oauth2/login/slack';
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
        provider: user?.provider ?? 'slack',
        access_token: user?.['_accessToken'] ?? '',
        refresh_token: user?._refreshToken ?? '',
        id: user.profile.email,
        unique_id: user.profile.email,
        bot_user_id: user?.['_bot_user_id'] ?? '',
        email: user.profile.email,
        name: user.profile.real_name,
        image: user.profile.image_original
      });

      res.redirect('/auth/callback?' + params.toString());
    })(req, res, next);
  });

export default router.handler();
