import { NextApiRequest, NextApiResponse } from 'next/types';
import { getTokenCookie } from './utils';

type ResponseData = {
  token: string;
};

export default function accessTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let bearerToken = getTokenCookie(req);

  if (!bearerToken) {
    bearerToken = '';
  } else {
    const cookie = JSON.parse(bearerToken);
    const token = cookie.token;
    bearerToken = token;
  }

  console.log('Bearer token:_', bearerToken);
  res.status(200).json({ token: bearerToken });
}
