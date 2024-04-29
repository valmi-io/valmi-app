//@ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 14th 2023, 3:17:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { FC, ReactElement, ReactNode, useEffect } from 'react';

import { useStore } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import CssBaseline from '@mui/material/CssBaseline';

import { CacheProvider, EmotionCache } from '@emotion/react';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import ThemeProviderWrapper from '@theme/ThemeProviderWrapper';

import createEmotionCache from 'src/createEmotionCache';

import { SidebarProvider } from '@contexts/SidebarContext';

import { wrapper } from '@store/store';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { SessionProvider } from 'next-auth/react';

import { initializeBugsnag, isBugsnagClientInitialized } from '@lib/bugsnag';

const clientSideEmotionCache = createEmotionCache();

config.autoAddCss = false;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
};

// Check that PostHog is client-side (used to handle Next.js SSR)
// if (typeof window !== 'undefined') {
//   posthog.init(process.env.POSTHOG_KEY as string, {
//     api_host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
//     // Enable debug mode in development
//     loaded: (posthog) => {
//       if (process.env.NODE_ENV === 'development') posthog.debug();
//     }
//   });
// }

// Bugsnag configuration
if (!isBugsnagClientInitialized()) {
  initializeBugsnag();
}

const MyApp: FC<AppPropsWithLayout> = ({ Component, emotionCache = clientSideEmotionCache, pageProps }) => {
  const store = useStore();

  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = ({ shallow }: { shallow: boolean }) => {
      if (!shallow) {
        NProgress.start();
      }
    };

    // Track page views
    const handleRouteComplete = () => {
      // posthog?.capture('$pageview');

      NProgress.done();
    };
    router.events.on('routeChangeComplete', handleRouteComplete);

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', () => NProgress.done());

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', () => NProgress.done());
    };
  }, []);

  console.log('page props session:_', pageProps);

  return (
    <PersistGate persistor={store.__persistor}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </Head>
        <SidebarProvider>
          <ThemeProviderWrapper>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <SessionProvider session={pageProps.session}>
                {/* <PostHogProvider client={posthog}> */}
                {getLayout(<Component {...pageProps} />)}
                {/* </PostHogProvider> */}
              </SessionProvider>
            </LocalizationProvider>
          </ThemeProviderWrapper>
        </SidebarProvider>
      </CacheProvider>
    </PersistGate>
  );
};

export default wrapper.withRedux(MyApp);
