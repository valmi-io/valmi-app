/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 9:39:17 pm
 * Author: Nagendra S @ valmi.io
 */

import { getAuthTokenCookie, getCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const { accessToken = '' } = (await getCookie(getAuthTokenCookie())) ?? '';

        setIsLoggedIn(!!accessToken);
      } catch (error) {
        // Handle any errors here
        setIsLoggedIn(false);
      }
    };

    getLoginStatus();
  }, [getCookie]);

  return { isLoggedIn };
};
