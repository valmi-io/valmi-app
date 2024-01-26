/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 12:50:55 pm
 * Author: Nagendra S @ valmi.io
 */

import nextConnect from 'next-connect';

import passport from '@lib/passport-slack';

// To Test locally use https://localhost - use local-ssl-proxy npm package
export default nextConnect()
  .use(passport.initialize())
  .get(
    passport.authenticate('slack', { failureRedirect: '/oauth_signin_failure' })
  );
