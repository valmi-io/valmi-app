/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
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
import AlertComponent from '@components/Alert';
import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '@components/Error/ErrorUtils';

import { useLazyLoginAndFetchWorkSpacesQuery } from '@store/api/apiSlice';
import { AppDispatch } from '@store/store';
import { setUserData } from '@store/reducers/user';
import { setAppState } from '@store/reducers/appFlow';
import { RootState } from '@store/reducers';

import { initialiseAppState } from '@utils/login-utils';
import { signinValidationSchema } from '@utils/validation-schema';
import { useLoginStatus } from '../../src/hooks/useLoginStatus';
import { signOutUser } from '../../src/utils/lib';

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  // sign in query
  const [loginAndFetchWorkSpaces, { isFetching }] =
    useLazyLoginAndFetchWorkSpacesQuery();

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const [loginData, setLoginData] = useState(null);

  const [userEmail, setUserEmail] = useState('');

  const { control, handleSubmit } = useAuthenticationForm(
    signinValidationSchema
  );

  const { isLoggedIn } = useLoginStatus();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    } else {
      signOutUser(router);
    }
  }, [isLoggedIn]);

  const displayAlertDialog = (message: any, isError: any) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  const onSubmit = (values: any) => {
    {
      /** Generate login payload */
    }
    const payload = generateAuthenticationPayload(values);
    setUserEmail(values['email']);
    loginHandler(payload);
  };

  const loginHandler = async (payload: any) => {
    try {
      const data: any = await loginAndFetchWorkSpaces(payload).unwrap();

      let isErrorAlert = false;
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        isErrorAlert = true;
        displayAlertDialog(traceError, isErrorAlert);
      } else {
        displayAlertDialog('Signed in successfully', isErrorAlert);
        setLoginData(data);
        // store user data in redux.
        dispatch(setUserData(data));

        const workspaceID = data.organizations[0].workspaces[0].id;
        // initialise appState
        initialiseAppState(dispatch, workspaceID);
        router.push(`/spaces/${workspaceID}/syncs`);
      }
    } catch (error) {
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};
      const isErrorAlert = true;
      displayAlertDialog(message, isErrorAlert);
    }
  };

  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
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
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
        displayButton={alertMessage === 'Unauthorized' ? true : false}
        onButtonClick={resendActivationLinkHandler}
        isError={isErrorAlert}
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
              href={'/signup'}
              footerText={"Don't have an account? Sign up"}
            />
          </Stack>
        </Stack>
      </AuthenticationLayout>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
