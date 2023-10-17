/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import nextConnect from 'next-connect';

import passport from '@lib/passport-facebook-auth';

export default nextConnect()
  .use(passport.initialize())
  .get(
    passport.authenticate('facebook', {
      scope: ['public_profile', 'ads_management', 'email'],
      session: false
    })
  );
