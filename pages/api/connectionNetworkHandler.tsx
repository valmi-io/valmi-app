/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 9:55:13 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';
import axios from 'axios';
import { getBaseUrl, getTokenCookie } from './utils';

const connectionNetworkHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let { connectionUrl, data } = req.body;
  let payload = data;
  // query
  connectionUrl = `${getBaseUrl()}${connectionUrl}`;

  let bearerToken = getTokenCookie(req);

  if (!bearerToken) {
    bearerToken = '';
  } else {
    const cookie = JSON.parse(bearerToken);
    const token = cookie.token;
    bearerToken = token;
  }

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
    // Handle any error that occurred during the request
    res.status(500).json({ error: error.message });
  }
};

export default connectionNetworkHandler;
