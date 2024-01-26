// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 5:27:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { Profile, Strategy as HubspotStrategy } from 'passport-hubspot-auth';
import passport from 'passport';

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user: Profile) => {
  return new Promise((resolve, reject) => {
    resolve('Successful');
  });
};

passport.use(
  new HubspotStrategy(
    {
      clientID: process.env.AUTH_HUBSPOT_CLIENT_ID as string,
      clientSecret: process.env.AUTH_HUBSPOT_CLIENT_SECRET as string,
      callbackURL: `${process.env.WEB_URL}/api/oauth2/redirect/hubspot`, // this is the endpoint you registered on google while creating your app. This endpoint would exist on your application for verifying the authentication
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, profile, cb: any) => {
      try {
        profile['_accessToken'] = _accessToken;
        profile['_refreshToken'] = _refreshToken;
        await saveUser(profile);
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
