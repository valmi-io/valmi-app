/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:34:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { parse } from 'cookie';

export const configureCredentials = (data: any) => {
  let config = data?.config
    ? data.config.credentials
    : data?.connector_config
    ? data.connector_config.credentials
    : {};

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

export function parseCookies(req: any) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getTokenCookie(req: any) {
  const cookies = parseCookies(req);
  return cookies['AUTH'];
}
