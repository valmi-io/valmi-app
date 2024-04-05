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

  let { src, dest, schedule, uiState, syncData, workspaceId } = req.body;

  let srcConnectionUrl = `${getBaseUrl()}/workspaces/${workspaceId}/sources/create`;
  let destConnectionUrl = `${getBaseUrl()}/workspaces/${workspaceId}/destinations/create`;
  let syncConnectionUrl = `${getBaseUrl()}/workspaces/${workspaceId}/syncs/create`;

  const bearerToken = (await getAccessTokenCookie(req)) || '';

  try {
    const srcResponse = await axios.post(srcConnectionUrl, src, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    const { id: sourceId } = srcResponse.data;

    const destResponse = await axios.post(destConnectionUrl, dest, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    const { id: destinationId } = destResponse.data;
    const syncPayload = {
      name: syncData?.syncName,
      source_id: sourceId,
      destination_id: destinationId,
      ui_state: uiState,
      schedule
    };
    const syncResponse = await axios.post(syncConnectionUrl, syncPayload, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    const data = syncResponse.data;

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
