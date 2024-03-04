/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, June 2nd 2023, 11:55:23 am
 * Author: Nagendra S @ valmi.io
 */

//@ts-nocheck

import axios from 'axios';

import { createRouter } from 'next-connect';

import { sendErrorToBugsnag } from '@lib/bugsnag';
import { oauthKeys } from '@/lib/oauth_middleware';

const router = createRouter();

router
  .use(oauthKeys)

  .get(async (req, res, next) => {
    const { state = '' } = req.query;

    let json = JSON.parse(decodeURIComponent(state));

    let { accessToken: access_token = '' } = json;

    let query_response = { ...(req.credentials ?? {}) };

    const client_id = query_response['AUTH_FACEBOOK_CLIENT_ID'];
    const client_secret = query_response['AUTH_FACEBOOK_CLIENT_SECRET'];

    // query
    const url = `https://graph.facebook.com/v16.0/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=fb_exchange_token&fb_exchange_token=${access_token}`;

    try {
      const response = await axios.get(url);

      const data = response.data;
      // Handle the response data as needed
      return res.status(200).json(data);
    } catch (error: any) {
      // send error to bugsnag
      sendErrorToBugsnag(error.message);
      // Handle any error that occurred during the request
      return res.status(500).json({ error: error.message });
    }
  });

export default router.handler();
