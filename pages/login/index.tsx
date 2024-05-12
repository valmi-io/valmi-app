/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Box, Container } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';

import { GoogleSignInButton } from '@/components/AuthButtons';

import { useSession } from 'next-auth/react';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import styled from '@emotion/styled';

const ContainerWrapper = styled(Container)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1312px',
  height: '364.25px',
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const BoxContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '648px',
  height: '364.25px',
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      //@ts-ignore
      router.push(`/spaces/${session?.workspaceId}/connections`);
    } else {
      router.push('/login');
    }
  }, [session]);

  return (
    <>
      <Head title="Login" />
      <ContainerWrapper>
        <BoxContainer sx={{ gap: (theme) => theme.spacing(2) }}>
          <ImageComponent src={'/images/dropbox.jpg'} alt="Logo" size={ImageSize.extralarge} />
        </BoxContainer>
        <AuthenticationLayout>
          <GoogleSignInButton />
        </AuthenticationLayout>
      </ContainerWrapper>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
