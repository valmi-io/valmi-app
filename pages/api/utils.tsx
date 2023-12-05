/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:34:39 pm
 * Author: Nagendra S @ valmi.io
 */

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

export const setTokenCookie = (accessToken: string) => {
  return fetch('/api/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accessToken })
  });
};

export const getAccessToken = () => {
  return fetch('/api/access', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const logoutUser = () => {
  return fetch('/api/logout', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
