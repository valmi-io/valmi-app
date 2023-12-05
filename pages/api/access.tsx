import { NextApiRequest, NextApiResponse } from 'next/types';

import cookie from 'cookie';

type ResponseData = {
  accessToken: string;
};

export default function accessTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const cookies = cookie.parse(req.headers?.cookie ?? '');
  const appCookie = cookies?.['AUTH'] ?? '';
  const parsedCookies = appCookie ? JSON.parse(appCookie) : {};
  const accessToken = parsedCookies?.accessToken ?? null;

  res.status(200).json({ accessToken: accessToken });
}
