import { NextApiRequest, NextApiResponse } from 'next/types';

import axios from 'axios';

const redirect = async (req: NextApiRequest, res: NextApiResponse) => {
  const { shop = '', code = '' } = req.query;

  console.log('redirect call:_', req.query);

  const url = `https://${shop}/admin/oauth/access_token?client_id=${
    process.env.AUTH_SHOPIFY_CLIENT_ID as string
  }&client_secret=${process.env.AUTH_SHOPIFY_CLIENT_SECRET as string}&code=${code}`;

  try {
    const response = await axios.post(url);

    const data = response.data;

    console.log('redirect response data:_', data);

    // Handle the response data as needed
    res.status(200).json(data);
  } catch (error: any) {
    const errorMessage = error?.response?.data ?? error.message;
    // send error to bugsnag

    console.log('redirect error:_', error);

    // Handle any error that occurred during the request
    res.status(500).json({ error: errorMessage });
  }
};

export default redirect;
