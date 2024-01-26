/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, June 2nd 2023, 11:55:23 am
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import axios from 'axios';

import { configureCredentials } from 'pages/api/utils';

import { sendErrorToBugsnag } from '@lib/bugsnag';

const getFbLongLivedToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let { url, method, data } = req.body;
  let payload = data;

  if (data?.config?.credentials) {
    // credentials with actual api keys attached
    payload = configureCredentials(data);
  }

  const access_token = payload?.config?.credentials?.access_token || '';
  const client_id = payload?.config?.credentials?.client_id || '';
  const client_secret = payload?.config?.credentials?.client_secret || '';

  // query
  url = `https://graph.facebook.com/v16.0/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=fb_exchange_token&fb_exchange_token=${access_token}`;

  try {
    const response = await axios.get(url);

    const data = response.data;
    // Handle the response data as needed
    res.status(200).json(data);
  } catch (error: any) {
    // send error to bugsnag
    sendErrorToBugsnag(error.message);
    // Handle any error that occurred during the request
    res.status(500).json({ error: error.message });
  }
};

export default getFbLongLivedToken;
