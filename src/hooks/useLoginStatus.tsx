/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 9:39:17 pm
 * Author: Nagendra S @ valmi.io
 */

import { getCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getLoginStatus = () => {
      try {
        const accessToken = getCookie('AUTH')?.accessToken ?? '';

        if (accessToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        // Handle any errors here
        setIsLoggedIn(false);
      }
    };

    getLoginStatus();
  }, [getCookie]);

  return { isLoggedIn };
};
