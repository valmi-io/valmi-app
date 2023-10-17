/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 5:24:52 pm
 * Author: Nagendra S @ valmi.io
 */

import nextConnect from 'next-connect';

import { NextApiRequest, NextApiResponse } from 'next/types';

import passport from '@lib/passport-hubspot';

export default nextConnect().get(
  passport.authenticate('hubspot', { session: false }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    const params = new URLSearchParams({
      provider: req.user.provider ? req.user.provider : 'hubspot',
      access_token: req.user['_accessToken'],
      refresh_token: req.user._refreshToken ? req.user['_refreshToken'] : '',
      id: req.user.user_id,
      unique_id: req.user.user,
      hub_id: req.user['hub_id'],
      email: req.user.user,
      name: req.user.user.split('@')[0],
      image: ''
    });

    res.redirect('/auth/callback?' + params.toString());
  }
);
