/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.AUTH_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET as string,
      authType: 'reauthenticate',
      profileFields: ['id', 'displayName', 'photos', 'email'],
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/facebook`
    },
    async (_accessToken, _refreshToken, profile: any, cb: any) => {
      try {
        profile['_accessToken'] = _accessToken;
        profile['_refreshToken'] = _refreshToken;
        return cb(null, profile);
      } catch (e: any) {
        throw new Error(e);
      }
    }
  )
);

// passport.serializeUser stores user object passed in the cb method above in req.session.passport
passport.serializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// passport.deserializeUser stores the user object in req.user
passport.deserializeUser(function (
  user: any,
  cb: (arg0: null, arg1: any) => any
) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// for broader explanation of serializeUser and deserializeUser visit https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

// An article that explains the concept of process.nextTick https://nodejs.dev/learn/understanding-process-nexttick

export default passport;
