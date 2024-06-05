/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from '@components/PageHead';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useSession } from 'next-auth/react';
import { initialiseAppState } from '@/utils/login-utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { getAuthMetaCookie, getAuthTokenCookie, getCookie, setCookie } from '@/lib/cookies';
import { useUser } from '@/hooks/useUser';
import { isObjectEmpty } from '@/utils/lib';

const HomePage = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const { loginFlowState } = useUser();

  const { data: session } = useSession();

  // This effect checks if the user has initiated a login flow
  // "DEFAULT" means not initiated.
  useEffect(() => {
    //@ts-ignore
    if (isObjectEmpty(loginFlowState) || !loginFlowState || loginFlowState === 'DEFAULT') {
      router.push('/login');
    }
  }, [loginFlowState]);

  // If workspaceId exists, navigate to connections
  useEffect(() => {
    if (workspaceId) {
      removeAuthMetaCookie().run();
      saveAuthTokenInCookie().run();
      router.push(`/spaces/${workspaceId}/connections`);
    }
  }, [workspaceId]);

  // This function checks if session exists. If exists, saves session to redux store.
  useEffect(() => {
    if (session) {
      if (session?.user && !workspaceId) {
        const data = {
          ...session.user,
          workspaceId: session.workspaceId
        };

        // save session to redux store.
        saveUserStateInStore(data).run();
      }
    }
  }, [session, workspaceId]);

  // remove additional params cookie
  const removeAuthMetaCookie = () => {
    return {
      run: async () => {
        const { meta = null } = (await getCookie(getAuthMetaCookie())) ?? '';
        if (meta) {
          await setCookie(getAuthMetaCookie(), '', {
            expires: new Date(0),
            path: '/'
          });
        }
      }
    };
  };

  // stores user information in redux store
  const saveUserStateInStore = (data: any) => {
    return {
      run: () => {
        initialiseAppState(dispatch, data);
      }
    };
  };

  // This function will save the authToken returned from the api backend to make api calls if not found in cookie.
  const saveAuthTokenInCookie = () => {
    return {
      run: async () => {
        const cookieObj = {
          accessToken: session?.authToken ?? ''
        };

        const { accessToken = '' } = (await getCookie(getAuthTokenCookie())) ?? '';

        if (!accessToken) {
          setCookie(getAuthTokenCookie(), JSON.stringify(cookieObj));
        }
      }
    };
  };

  return (
    <>
      <Head />
    </>
  );
};

export default HomePage;
