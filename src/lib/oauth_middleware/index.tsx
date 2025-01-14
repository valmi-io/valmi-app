/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, February 2nd 2024, 5:53:11 pm
 * Author: Nagendra S @ valmi.io
 */
//@ts-nocheck

import { getAccessTokenCookie, getBaseUrl } from '@/pagesapi/utils';
import axios from 'axios';

export const oauthKeys = async (req, res, next) => {
  const { state = '' } = req.query;

  let json = JSON.parse(decodeURIComponent(state));

  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  let { workspace = '', connector = '', oauth_keys = 'private' } = json;

  if (oauth_keys === 'public') {
    return next();
  }

  let url = `${getBaseUrl()}/oauth/workspaces/${workspace}/keys/${connector}`;

  const bearerToken = (await getAccessTokenCookie(req)) || '';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    req.credentials = response.data[0].oauth_config;
  } catch (error: any) {

  } finally {
    await next();
  }
};
