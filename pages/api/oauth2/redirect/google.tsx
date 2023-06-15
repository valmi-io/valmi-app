/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 9:37:18 am
 * Author: Nagendra S @ valmi.io
 */

import nextConnect from 'next-connect';
import passport from '@/lib/passport-google-auth';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default nextConnect().get(
  passport.authenticate('google', { session: false }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    const params = new URLSearchParams({
      provider: req.user.provider ? req.user.provider : 'google',
      access_token: req.user['_accessToken'],
      refresh_token: req.user._refreshToken ? req.user['_refreshToken'] : '',
      id: req.user.id,
      email: req.user.emails[0].value,
      name: req.user.displayName,
      image: req.user.photos[0].value,
      unique_id: req.user.emails[0].value
    });

    res.redirect('/auth/callback?' + params.toString());
  }
);
