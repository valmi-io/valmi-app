/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { Stack } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';
import { AppDispatch } from '@store/store';

import { GoogleSignInButton } from '@/components/AuthButtons';

import { useSession } from 'next-auth/react';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  console.log('Login session:_', session);

  const { workspaceId = null } = useWorkspaceId();

  useEffect(() => {
    if (workspaceId) {
      router.push(`/spaces/${workspaceId}/connections`);
    } else {
      dispatch({ type: 'RESET_STORE' });
    }
  }, [workspaceId]);

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
