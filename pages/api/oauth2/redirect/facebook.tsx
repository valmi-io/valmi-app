/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 4:52:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';
import nextConnect from 'next-connect';
import passport from '@/lib/passport-facebook-auth';

export default nextConnect().get(
  passport.authenticate('facebook', { session: false }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    const params = new URLSearchParams({
      provider: req.user.provider ? req.user.provider : 'facebook',
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
