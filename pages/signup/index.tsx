/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:34:45 pm
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
  generateSignupFormFields
} from '@content/Authentication/AuthenticationFormUtils';

import Head from '@components/PageHead';
import AlertComponent, { AlertStatus, AlertType } from '@components/Alert';

import { useLazySignupUserQuery } from '@store/api/apiSlice';
import { AppDispatch } from '@store/store';
import { setAppState } from '@store/reducers/appFlow';
import { RootState } from '@store/reducers';

import { signupValidationSchema } from '@utils/validation-schema';
import { useLoginStatus } from '@hooks/useLoginStatus';
import { queryHandler } from '@/services';

const SignupPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // signup query
  const [signupUser, { isFetching }] = useLazySignupUserQuery();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const [userData, setUserData] = useState(null);

  const [userEmail, setUserEmail] = useState('');

  const { control, handleSubmit } = useAuthenticationForm(signupValidationSchema);

  const { isLoggedIn } = useLoginStatus();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  const onSubmit = (values: any) => {
    setUserData(null);
    {
      /** Generate signup payload */
    }
    const payload = generateAuthenticationPayload(values);
    setUserEmail(values['email']);

    signupHandler({ query: signupUser, payload: payload });
  };

  const successCb = (data: any) => {
    handleAlertOpen({ message: 'Signed up successfully', alertType: 'success' as AlertStatus });
    setUserData(data);
    const { is_active = false, email = '' } = data || {};
    let isLoggedIn = false;
    let emailSentDialog = false;
    if (is_active) {
      isLoggedIn = true;
    } else {
      emailSentDialog = true;
    }
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: {
          isLoggedIn: isLoggedIn,
          userEmail: email,
          emailSentDialog: emailSentDialog,
          resendActivationLink: false
        }
      })
    );
    router.push('/activate');
  };

  const errorCb = (error: any) => {
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const signupHandler = async ({ query, payload }: { query: any; payload: any }) => {
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
      <Head title="Signup" />

      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
        displayButton={alertState.message === 'user with this email address already exists.' ? true : false}
        onButtonClick={resendActivationLinkHandler}
      />

      {/** Page layout*/}
      <AuthenticationLayout>
        {/** Display Signup form */}
        <AuthenticationForm
          fields={generateSignupFormFields()}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isFetching={isFetching}
          data={userData}
          buttonText={' Sign up'}
        />
        <Stack sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {/** Display footer */}
            <AuthenticationFormFooter href={'/login'} footerText={'Already have an account? Sign in'} />
          </Stack>
        </Stack>
      </AuthenticationLayout>
    </>
  );
};

SignupPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default SignupPage;
