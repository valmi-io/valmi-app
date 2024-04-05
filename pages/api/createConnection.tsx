/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 9:55:13 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import axios from 'axios';

import { getAccessTokenCookie, getBaseUrl } from 'pages/api/utils';

import { sendErrorToBugsnag } from '@lib/bugsnag';

const createConnection = async (req: NextApiRequest, res: NextApiResponse) => {
  // get all the payloads required to create below objects.
  // 1. create / update credential(integration with configuration) object /credentials/create(or update)
  // 2. if success: create source object /sources/create
  // 3. if sucess: create destination object /destinations / create
  // 4. if sucess: create sync object /syncs/create
  // 5. if any on the above case failed: throw error.

  let { connectionUrl, data } = req.body;
  let payload = data;
  // query
  connectionUrl = `${getBaseUrl()}${connectionUrl}`;

  const bearerToken = (await getAccessTokenCookie(req)) || '';

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

export default createConnection;
