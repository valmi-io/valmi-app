/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, December 5th 2023, 9:39:17 pm
 * Author: Nagendra S @ valmi.io
 */

import { getAuthTokenCookie, getCookie } from '@/lib/cookies';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const { accessToken = '' } = (await getCookie(getAuthTokenCookie())) ?? '';

        if (accessToken && session) {
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
  }, [getCookie, session]);

  //@ts-ignore
  const workspaceId = session?.workspaceId ?? '';

  return { isLoggedIn, workspaceId };
};
