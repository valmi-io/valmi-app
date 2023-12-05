import { NextApiRequest, NextApiResponse } from 'next/types';

import { getAccessTokenCookie } from './utils';

type ResponseData = {
  accessToken: string;
};

export default function accessTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const accessToken = getAccessTokenCookie(req) || '';

  res.status(200).json({ accessToken: accessToken });
}
