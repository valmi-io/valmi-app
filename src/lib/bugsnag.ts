import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

export const initializeBugsnag = () => {
  // next.js executes top-level code at build time. See https://github.com/vercel/next.js/discussions/16840 for further example
  // So use NEXT_PHASE to avoid Bugsnag.start being executed during the build phase
  // See https://nextjs.org/docs/api-reference/next.config.js/introduction and https://github.com/vercel/next.js/blob/canary/packages/next/shared/lib/constants.ts#L1-L5 for
  // more details on NEXT_PHASE
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    if (traceBugsnag()) {
      Bugsnag.start({
        apiKey: process.env.BUGSNAG_KEY as string,
        plugins: [new BugsnagPluginReact(React)],
        appType: process.env.BUGSNAG_APP_TYPE,
        autoDetectErrors:
          process.env.BUGSNAG_AUTO_DETECT_ERRORS === 'true' ? true : false,
        appVersion: process.env.BUGSNAG_APP_VERSION
      });
    }
  }
};

// check whether the BugSnag client has been initialized.
export const isBugsnagClientInitialized = () => {
  return Bugsnag.isStarted();
};

export const traceBugsnag = () => {
  return process.env.BUGSNAG_TRACING === 'true';
};

export const sendErrorToBugsnag = (error: any) => {
  Bugsnag.notify(error);
};
