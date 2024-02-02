/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, February 2nd 2024, 5:53:11 pm
 * Author: Nagendra S @ valmi.io
 */
//@ts-nocheck

import { getAccessTokenCookie, getBaseUrl } from '@/pagesapi/utils';
import axios from 'axios';

export const oauthKeys = async (req, res, next) => {
  let { workspace = '', connector = '' } = req.query;

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
    // console.log('error while fetching oauth keys:-');
  } finally {
    await next();
  }
};
