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
import GridLayout from '@/components/grid';

const ContainerWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  margin: 0,
  minWidth: '1024px',
  maxWidth: '1312px',
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const ImageBoxContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minWidth: '440px',
  height: '364.25px',
  padding: '1px 0px',
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
      {/* <GridLayout> */}
      <ContainerWrapper>
        <ImageBoxContainer>
          <ImageComponent src={'/images/dropbox.jpg'} alt="Logo" size={ImageSize.extralarge} />
        </ImageBoxContainer>
        <AuthenticationLayout>
          <GoogleSignInButton />
        </AuthenticationLayout>
      </ContainerWrapper>
      {/* </GridLayout> */}
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
