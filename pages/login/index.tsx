/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Stack } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';

import { GoogleSignInButton } from '@/components/AuthButtons';

import { useLoginStatus } from '@/hooks/useLoginStatus';
import { signOutUser } from '@/utils/lib';
import { useDispatch } from 'react-redux';
import { useLazyLogoutUserQuery } from '@/store/api/apiSlice';

const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // logout user query
  const [logoutUser] = useLazyLogoutUserQuery();

  const { isLoggedIn, workspaceId } = useLoginStatus();

  useEffect(() => {
    console.log('Is logged in:_', isLoggedIn, workspaceId);
    if (isLoggedIn && workspaceId) {
      //@ts-ignore
      router.push(`/spaces/${workspaceId}/connections`);
    } else {
      signOutUser(router, dispatch, logoutUser);
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head title="Login" />

      {/** Page layout */}
      <AuthenticationLayout>
        <Stack sx={{ marginTop: 2 }}>
          <GoogleSignInButton />
        </Stack>
      </AuthenticationLayout>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
