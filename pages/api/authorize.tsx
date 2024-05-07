import { NextApiRequest, NextApiResponse } from 'next/types';

const SCOPES = ['read_orders', 'read_products', 'write_products'];

const authorize = async (req: NextApiRequest, res: NextApiResponse) => {
  let store = '';
  const { shop = '' } = req.query;

  let { data } = req.body;
  let payload = data;

  if (!shop) {
    store = payload.shop ?? '';
  } else {
    store = shop as string;
  }

  try {
    const redirect_uri = 'http://localhost:3000/api/redirect';

    const url = `https://${store}.myshopify.com/admin/oauth/authorize?client_id=${
      process.env.AUTH_SHOPIFY_CLIENT_ID as string
    }&scope=${SCOPES}&redirect_uri=${redirect_uri}`;

    res.redirect(url);
  } catch (error: any) {
    console.error('shopify error', error);
    const errorMessage = error?.response?.data ?? error.message;
    res.status(500).json({ error: errorMessage });
  }
};

export default authorize;
