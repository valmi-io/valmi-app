/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Box, Paper, styled } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';

import { GoogleSignInButton } from '@/components/AuthButtons';

import { useSession } from 'next-auth/react';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import GridLayout from '@/components/grid';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import { signOutUser } from '@/utils/lib';
import { useDispatch } from 'react-redux';
import { useLazyLogoutUserQuery } from '@/store/api/apiSlice';

        
const ContainerWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  margin: 0,
  width: '100%',
  height: '364.25px',
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const ImageBoxContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minWidth: '440px',
  padding: '1px 0px',
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));
  
 
const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

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
