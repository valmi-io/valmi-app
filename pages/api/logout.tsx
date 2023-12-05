/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 9:13:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import cookie from 'cookie';

type ResponseData = {
  success: boolean;
};

export default function accessTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('AUTH', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/'
    })
  );

  res.status(200).json({ success: true });
}
