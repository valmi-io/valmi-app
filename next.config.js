/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

module.exports = {
  devIndicators: {
    buildActivity: false
  },
  env: {
    API_URL: process.env.API_URL,
    WEB_URL: process.env.WEB_URL,
    POSTHOG_KEY: process.env.POSTHOG_KEY,
    POSTHOG_HOST: process.env.POSTHOG_HOST,
    PUBLIC_WORKSPACE: process.env.PUBLIC_WORKSPACE,
    PUBLIC_SYNC: process.env.PUBLIC_SYNC,
    PUBLIC_SYNC_URL: process.env.PUBLIC_SYNC_URL,
    BUGSNAG_KEY: process.env.BUGSNAG_KEY,
    BUGSNAG_TRACING: process.env.BUGSNAG_TRACING,
    BUGSNAG_APP_TYPE: process.env.BUGSNAG_APP_TYPE,
    BUGSNAG_APP_VERSION: process.env.BUGSNAG_APP_VERSION,
    BUGSNAG_AUTO_DETECT_ERRORS: process.env.BUGSNAG_AUTO_DETECT_ERRORS
  }
};
