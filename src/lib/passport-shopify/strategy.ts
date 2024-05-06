/*
 * Module dependencies.
 */
//@ts-nocheck
import { InternalOAuthError, Strategy as OAuth2Strategy } from 'passport-oauth2';
import { isUndefined, defaults } from 'lodash';

const SHOP_NAME_SLUG = /^[a-z0-9-_]+$/i;

/*
 * Inherit `Strategy` from `OAuth2Strategy`.
 */
class Strategy extends OAuth2Strategy {
  constructor(options = {}, verify) {
    defaults(options, {
      shop: 'example'
    });

    let shopName;
    if (options.shop.match(SHOP_NAME_SLUG)) {
      shopName = `${options.shop}.myshopify.com`;
    } else {
      shopName = options.shop;
    }

    defaults(options, {
      authorizationURL: `https://${shopName}/admin/oauth/authorize?grant_options[]=per-user`,
      tokenURL: `https://${shopName}/admin/oauth/access_token`,
      profileURL: `https://${shopName}/admin/shop.json`,
      userAgent: 'passport-shopify',
      customHeaders: {},
      scopeSeparator: ','
    });

    defaults(options.customHeaders, {
      'User-Agent': options.userAgent
    });

    super(options, verify);
    this.name = 'shopify';

    this._profileURL = options.profileURL;
    this._clientID = options.clientID;
    this._clientSecret = options.clientSecret;
    this._callbackURL = options.callbackURL;
  }

  userProfile(accessToken, done) {
    this._oauth2.get(this._profileURL, accessToken, (err, body) => {
      if (err) {
        return done(new InternalOAuthError('Failed to fetch user profile', err));
      }

      // check if the user has all the permissions

      try {
        const json = JSON.parse(body);
        const profile = {
          provider: 'shopify'
        };
        profile.id = json.shop.id;
        profile.displayName = json.shop.shop_owner;
        profile.username = json.shop.name;
        profile.profileURL = json.shop.domain;
        profile.emails = [
          {
            value: json.shop.email
          }
        ];
        profile._raw = body;
        profile._json = json;

        return done(null, profile);
      } catch (e) {
        return done(e);
      }
    });
  }
  authorizationParams = function (options) {
    // let extras = {};
    // if (options.extra_params) {
    //   extras = options.extra_params;
    // }
    // if (options.user_scope) {
    //   extras.user_scope = options.user_scope.join(',');
    // }

    // return extras;
    console.log('authorizationParams', options);
    return {};
  };

  async logout(req) {
    console.log('Logout req', req);
    await req.logout(function (err) {
      if (err) {
        console.log('error while logging out', err);
        // return next(err);
      } else {
        console.log('session logged out');
      }

      // res.redirect('/');
    });
  }

  async authenticate(req, options) {
    console.log('is user authenticated', req.isAuthenticated());

    console.log('auth info', req.authInfo);

    // If shop is defined
    // with authentication
    if (!isUndefined(options.shop)) {
      const shopName = this.normalizeShopName(options.shop);

      // update _oauth2 settings
      this._oauth2._authorizeUrl = `https://${shopName}/admin/oauth/authorize?grant_options[]=per-user`;
      this._oauth2._accessTokenUrl = `https://${shopName}/admin/oauth/access_token`;
      this._profileURL = `https://${shopName}/admin/shop.json`;
    }

    // console.log('calling super authenticate ====================', req);

    // Call superclass
    return super.authenticate(req, options);
  }

  normalizeShopName(shop) {
    if (shop.match(SHOP_NAME_SLUG)) {
      return `${shop}.myshopify.com`;
    }

    return shop;
  }
}

// Expose constructor.
module.exports = Strategy;
