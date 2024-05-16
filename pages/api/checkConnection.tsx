/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:03:02 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import axios from 'axios';

import { getAccessTokenCookie, getBaseUrl } from 'pages/api/utils';

import { sendErrorToBugsnag } from '@lib/bugsnag';

const checkConnection = async (req: NextApiRequest, res: NextApiResponse) => {
  let { url, method, data } = req.body;
  let payload = data;

  // query
  url = `${getBaseUrl()}${url}`;

  const bearerToken = (await getAccessTokenCookie(req)) || '';

  console.log('bearer token: ', bearerToken);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    const data = response.data;

    // Handle the response data as needed
    res.status(200).json(data);
  } catch (error: any) {
    const errorMessage = error?.response?.data ?? error.message;
    // send error to bugsnag
    sendErrorToBugsnag(errorMessage);
    // Handle any error that occurred during the request
    res.status(500).json({ error: errorMessage });
  }
};

export default checkConnection;
