/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 12:50:55 pm
 * Author: Nagendra S @ valmi.io
 */

import passport from '@/lib/passport-slack';
import nextConnect from 'next-connect';

// To Test locally use https://localhost - use local-ssl-proxy npm package
export default nextConnect()
  .use(passport.initialize())
  .get(
    passport.authenticate('slack', { failureRedirect: '/oauth_signin_failure' })
  );
