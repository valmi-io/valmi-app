/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 8:16:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import cookie from 'cookie';

type ResponseData = {
  success: boolean;
};

export default function accessTokenHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { accessToken } = req.body;

  const cookieObj = {
    accessToken
  };

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('AUTH', JSON.stringify(cookieObj), {
      // httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      path: '/'
    })
  );

  res.status(200).json({ success: true });
}
