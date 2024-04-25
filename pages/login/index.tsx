/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';
import { useAuthenticationForm } from '@content/Authentication/useAuthenticationForm';
import AuthenticationFormFooter from '@content/Authentication/AuthenticationFormFooter';
import AuthenticationForm from '@content/Authentication/AuthenticationForm';
import {
  generateAuthenticationPayload,
  generateLoginFormFields
} from '@content/Authentication/AuthenticationFormUtils';

import Head from '@components/PageHead';
import AlertComponent, { AlertStatus, AlertType } from '@components/Alert';

import { useLazyLoginAndFetchWorkSpacesQuery } from '@store/api/apiSlice';
import { AppDispatch } from '@store/store';
import { setAppState } from '@store/reducers/appFlow';
import { RootState } from '@store/reducers';

import { initialiseAppState } from '@utils/login-utils';
import { signinValidationSchema } from '@utils/validation-schema';
import { useLoginStatus } from '@hooks/useLoginStatus';
import { signOutUser } from '@utils/lib';
import { queryHandler } from '@/services';
import { GoogleSignInButton } from '@/components/AuthButtons';

import { useSession } from 'next-auth/react';

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  // sign in query
  const [loginAndFetchWorkSpaces, { isFetching }] = useLazyLoginAndFetchWorkSpacesQuery();

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const [loginData, setLoginData] = useState(null);

  const [userEmail, setUserEmail] = useState('');

  const { control, handleSubmit } = useAuthenticationForm(signinValidationSchema);

  const { isLoggedIn } = useLoginStatus();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    } else {
      dispatch({ type: 'RESET_STORE' });
      signOutUser(router);
    }
  }, [isLoggedIn]);

  const onSubmit = (values: any) => {
    {
      /** Generate login payload */
    }
    const payload = generateAuthenticationPayload(values);
    setUserEmail(values['email']);
    loginHandler({ query: loginAndFetchWorkSpaces, payload: payload });
  };

  const successCb = (data: any) => {
    handleAlertOpen({ message: 'Signed in successfully', alertType: 'success' as AlertStatus });
    setLoginData(data);

    const { username = '', email = '' } = data ?? {};
    const workspaceID = data.organizations[0].workspaces[0].id;

    let obj = {
      workspaceId: workspaceID,
      username: username,
      email: email
    };
    initialiseAppState(dispatch, appState, obj);

    // initialise appState
    router.push(`/spaces/${workspaceID}/connections`);
  };

  const errorCb = (error: any) => {
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const loginHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
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

  const resendActivationLinkHandler = () => {
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: {
          isLoggedIn: false,
          userEmail: userEmail,
          emailSentDialog: false,
          resendActivationLink: true
        }
      })
    );
    router.push('/activate');
  };

  return (
    <>
      <Head title="Login" />

      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
        displayButton={alertState.message === 'Unauthorized' ? true : false}
        onButtonClick={resendActivationLinkHandler}
      />

      {/** Page layout */}
      <AuthenticationLayout>
        {/** Display form */}
        <AuthenticationForm
          fields={generateLoginFormFields()}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isFetching={isFetching}
          data={loginData}
          buttonText={'Sign in'}
        />
        <Stack sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {/** Display footer */}
            <AuthenticationFormFooter
              isLoginPage={true}
              href={'/signup'}
              footerText={"Don't have an account? Sign up"}
            />
          </Stack>
        </Stack>
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
