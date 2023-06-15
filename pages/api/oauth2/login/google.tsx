/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 19th 2023, 12:30:22 pm
 * Author: Nagendra S @ valmi.io
 */

import passport from '@/lib/passport-google-auth';
import nextConnect from 'next-connect';

export default nextConnect()
  .use(passport.initialize())
  .get(
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/adwords'
      ],
      session: false,
      accessType: 'offline',
      prompt: 'consent'
    })
  );
