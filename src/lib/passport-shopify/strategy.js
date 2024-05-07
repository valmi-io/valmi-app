/*
 * Module dependencies.
 */
//@ts-nocheck
import { InternalOAuthError, Strategy as OAuth2Strategy } from 'passport-oauth2';
import { defaults } from 'lodash';

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
      authorizationURL: `https://${shopName}/admin/oauth/authorize`,
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

    this._authorizationURL = options.authorizationURL;
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

  _loadUserProfile = function (accessToken, done) {
    var self = this;

    function loadIt() {
      return self.userProfile(accessToken, done);
    }
    function skipIt() {
      return done(null);
    }

    if (typeof this._skipUserProfile == 'function' && this._skipUserProfile.length > 1) {
      // async
      this._skipUserProfile(accessToken, function (err, skip) {
        if (err) {
          return done(err);
        }
        if (!skip) {
          return loadIt();
        }
        return skipIt();
      });
    } else {
      var skip = typeof this._skipUserProfile == 'function' ? this._skipUserProfile() : this._skipUserProfile;
      if (!skip) {
        return loadIt();
      }
      return skipIt();
    }
  };

  async authenticate(req, options) {
    var self = this;

    const redirectToAuthorization = () => {
      const redirectURL = self._oauth2.getAuthorizeUrl({
        redirect_uri: this._callbackURL,
        scope: options.scope || [],
        state: options.state
      });

      self.redirect(redirectURL);
    };

    if ((req.query && req.query.code) || (req.body && req.body.code)) {
      const code = (req.query && req.query.code) || (req.body && req.body.code);

      // Exchange code for access token
      self._oauth2.getOAuthAccessToken(code, {}, (err, accessToken, refreshToken, params) => {
        if (err) {
          return self.error(self._createOAuthError('Failed to obtain access token', err));
        }
        if (!accessToken) {
          return self.error(new Error('Failed to obtain access token'));
        }

        // Now you have the accessToken, you can save it or use it as needed

        // Continue with authentication logic, e.g., fetching user profile

        self._loadUserProfile(accessToken, function (err, profile) {
          if (err) {
            return self.error(err);
          }

          function verified(err, user, info) {
            if (err) {
              return self.error(err);
            }
            if (!user) {
              return self.fail(info);
            }

            info = info || {};

            self.success(user, info);
          }

          try {
            if (self._passReqToCallback) {
              var arity = self._verify.length;
              if (arity == 6) {
                self._verify(req, accessToken, refreshToken, params, profile, verified);
              } else {
                // arity == 5
                self._verify(req, accessToken, refreshToken, profile, verified);
              }
            } else {
              var arity = self._verify.length;

              if (arity == 5) {
                self._verify(accessToken, refreshToken, params, profile, verified);
              } else {
                // arity == 4
                self._verify(accessToken, refreshToken, profile, verified);
              }
            }
          } catch (ex) {
            return self.error(ex);
          }
        });
      });
    } else {
      redirectToAuthorization();
    }
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
