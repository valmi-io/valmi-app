/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from '@components/PageHead';
import { useLazyLogoutUserQuery } from '@/store/api/apiSlice';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import { signOutUser } from '@/utils/lib';
import { useDispatch } from 'react-redux';

const HomePage = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  // logout user query
  const [logoutUser] = useLazyLogoutUserQuery();

  const { isLoggedIn, workspaceId } = useLoginStatus();

  useEffect(() => {
    if (isLoggedIn) {
      //@ts-ignore
      router.push(`/spaces/${workspaceId}/connections`);
    } else {
      if (workspaceId) {
        signOutUser(router, dispatch, logoutUser);
      } else {
        router.push('/login');
      }
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head />
    </>
  );
};

export default HomePage;
