/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 9:39:17 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        // const response = await getAccessToken();
        // const jsonData = await response.json();

        // const accessToken = jsonData.accessToken || '';

        const accessToken = cookie.load('AUTH')?.accessToken ?? null;
        if (accessToken) {
          setIsLoggedIn(true);
        }
      } catch (error) {
      } finally {
        setIsLoggedIn(false);
      }

      getLoginStatus();
    };
  }, []);

  return { isLoggedIn };
};
