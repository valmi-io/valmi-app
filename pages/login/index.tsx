/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Box, Paper, styled } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';

import { signIn, useSession } from 'next-auth/react';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { signOutUser } from '@/utils/lib';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyLogoutUserQuery } from '@/store/api/apiSlice';
import { useSearchParams } from 'next/navigation';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { Error, errorMap } from '@/components/Error/ErrorUtils';
import { AppFlowState, setAppState } from '@/store/reducers/appFlow';
import { RootState } from '@/store/reducers';
import LogoCarousel from '@/pageslogin/LogoCarousel';

const ContainerWrapper = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  minHeight: '364.25px',
  gap: theme.spacing(2)
}));

const ImageBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: '100%',
  height: '100%',
  minWidth: '440px',
  maxWidth: '648px',
  padding: '1px 0px'
}));

const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const search = useSearchParams();

  const error = search.get('error') as Error;

  const { data: session } = useSession();

  // logout user query
  const [logoutUser] = useLazyLogoutUserQuery();

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const [oauthError, setOauthError] = useState('');

  /**
   * Updates loginFlowState
   */
  useEffect(() => {
    updateLoginFlowState();
  }, []);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      console.error('[login.tsx]: refresh access token error');
      signIn('google', { callbackUrl: '/' }); // Force sign in to hopefully resolve error
    }
  }, [session]);

  // This function handles both google oauth errors (next-auth errors)
  // & api backend error caused while user logging in.
  useEffect(() => {
    if (error) {
      if (!oauthError) {
        setOauthError(session?.error ?? errorMap[error] ?? errorMap['Default']);
      }
    }
  }, [error]);

  useEffect(() => {
    if (oauthError) {
      oAuthErrorState({ error: oauthError }).run();
    }
  }, [oauthError]);

  /**
   * Dispatches a Redux action to update the `loginFlowState` in the app state
   * with the value `'DEFAULT'`.
   */
  const updateLoginFlowState = () => {
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: 'DEFAULT'
      })
    );
  };

  const oAuthErrorState = ({ error }: { error: string }) => {
    return {
      run: () => {
        // display error if not already shown.
        if (!alertState.show) {
          handleAlertOpen({ message: error, alertType: 'error' });
          // clear session & access_token cookies if exists.
          signOutUser(router, dispatch, logoutUser);
        }
      }
    };
  };

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  return (
    <>
      <Head title="Login" />
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      {/* <GridLayout> */}
      <ContainerWrapper variant="outlined">
        <ImageBoxContainer
          sx={{
            display: {
              xs: 'none',
              sm: 'flex'
            }
          }}
        >
          <LogoCarousel />
          {/* <ImageComponent src={'/images/dropbox.jpg'} alt="Logo" size={ImageSize.extralarge} /> */}
        </ImageBoxContainer>

        <AuthenticationLayout />
      </ContainerWrapper>
      {/* </GridLayout> */}
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
