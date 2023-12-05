/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 9:55:13 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import axios from 'axios';

import { getAccessTokenCookie, getBaseUrl } from 'pages/api/utils';

import { sendErrorToBugsnag } from '@lib/bugsnag';

const connectionNetworkHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let { connectionUrl, data } = req.body;
  let payload = data;
  // query
  connectionUrl = `${getBaseUrl()}${connectionUrl}`;

  const bearerToken = getAccessTokenCookie(req) || '';

  try {
    const response = await axios.post(connectionUrl, payload, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

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

export default connectionNetworkHandler;
