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
import { clearAuthMetaCookie, setAuthTokenCookie } from '@/lib/cookies';
import { useUser } from '@/hooks/useUser';

const HomePage = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const { loginFlowState } = useUser();

  const { data: session } = useSession();

  // This effect checks if the user has initiated a login flow
  // "DEFAULT" means not initiated.
  useEffect(() => {
    if (loginFlowState === 'DEFAULT') {
      router.push('/login');
    }
  }, [loginFlowState]);

  // If workspaceId exists, navigate to connections
  useEffect(() => {
    if (workspaceId) {
      // This will clear authmeta cookie set when login flow is initiated.
      clearAuthMetaCookie();

      // This will save the authToken returned from the api backend to make api calls if not found in cookie.
      setAuthTokenCookie(session!);

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

  // stores user information in redux store
  const saveUserStateInStore = (data: any) => {
    return {
      run: () => {
        initialiseAppState(dispatch, data);
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
