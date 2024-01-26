/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 12:42:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import nextConnect from 'next-connect';

import passport from '@lib/passport-slack';

export default nextConnect().get(
  passport.authenticate('slack', { session: false }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    const params = new URLSearchParams({
      provider: req.user.provider ? req.user.provider : 'slack',
      access_token: req.user['_accessToken'],
      refresh_token: req.user._refreshToken ? req.user['_refreshToken'] : '',
      id: req.user.profile.email,
      unique_id: req.user.profile.email,
      bot_user_id: req.user['_bot_user_id'],
      email: req.user.profile.email,
      name: req.user.profile.real_name,
      image: req.user.profile.image_original
    });
    res.redirect('/auth/callback?' + params.toString());
  }
);
