/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:34:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { getAuthTokenCookie } from '@/lib/cookies';
import cookie from 'cookie';

export const configureCredentials = (data: any) => {
  let config = data?.config ? data.config.credentials : data?.connector_config ? data.connector_config.credentials : {};

  Object.entries(config).forEach(([key, value]) => {
    if (typeof value !== 'string') return;
    const apiKey = value.split('_')[0];

    if (apiKey === 'AUTH') {
      const realAPIKey = process.env[`${value}`];
      config[key] = realAPIKey;
    }
  });

  return data;
};

export const getBaseUrl = () => {
  return process.env[`SERVER_SIDE_API_URL`];
};

export const getAccessTokenCookie = async (req: any) => {
  const cookies = cookie.parse(req.headers?.cookie ?? '');
  const appCookie = cookies?.[getAuthTokenCookie()] ?? '';
  const parsedCookies = appCookie ? JSON.parse(appCookie) : {};
  const accessToken = parsedCookies?.accessToken ?? null;
  return accessToken;
};
