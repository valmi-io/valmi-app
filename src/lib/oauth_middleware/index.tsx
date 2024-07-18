//@ts-nocheck

import { getAccessTokenCookie, getBaseUrl } from '@/pagesapi/utils';
import axios from 'axios';

export const oauthKeys = async (req, res, next) => {
  const { state = '' } = req.query;

  // let json = JSON.parse(decodeURIComponent(state));

  return next();
  //   if (typeof json === 'string') {
  //     json = JSON.parse(json);
  //   }

  //   let { workspace = '', connector = '', oauth_keys = 'private' } = json;

  //   if (oauth_keys === 'public') {
  //     return next();
  //   }

  //   let url = `${getBaseUrl()}/oauth/workspaces/${workspace}/keys/${connector}`;

  //   const bearerToken = (await getAccessTokenCookie(req)) || '';

  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${bearerToken}`
  //       }
  //     });

  //     req.credentials = response.data[0].oauth_config;
  //   } catch (error: any) {
  //   } finally {
  //     await next();
  //   }
};
