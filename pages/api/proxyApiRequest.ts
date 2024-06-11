import axios from 'axios';

import { getAccessTokenCookie, getBaseUrl } from '@/pagesapi/utils';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { sendErrorToBugsnag } from '@/lib/bugsnag';
import { handleAxiosError } from '@/components/Error/ErrorUtils';

const proxyApiRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Process a POST request
    let { url, data } = req.body;
    let payload = data;

    // query
    url = `${getBaseUrl()}${url}`;

    const bearerToken = (await getAccessTokenCookie(req)) || '';

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
      handleAxiosError(error, (err) => {
        // send error to bugsnag
        sendErrorToBugsnag(err);
        // Handle any error that occurred during the request
        return res.status(500).json({ error: err });
      });
    }
  }
};

export default proxyApiRequestHandler;
