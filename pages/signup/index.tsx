/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:34:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { CircularProgress, Stack, Typography } from '@mui/material';
import { CheckOutlined } from '@mui/icons-material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

import Head from '@components/PageHead';
import AlertComponent from '@components/Alert';
import {
  hasErrorsInData,
  getErrorsInData,
  getErrorsInErrorObject
} from '@components/Error/ErrorUtils';

import { useLazySignupUserQuery } from '@store/api/apiSlice';
import { AppDispatch } from '@store/store';
import { setAppState } from '@store/reducers/appFlow';
import { RootState } from '@store/reducers';

import authStorage from '@utils/auth-storage';
import {
  getUsernameField,
  getEmailField,
  getPasswordField
} from '@utils/form-utils';
import { signupValidationSchema } from '@utils/validation-schema';

const SignupPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // signup query
  const [signupUser, { isFetching }] = useLazySignupUserQuery();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const [userData, setUserData] = useState(null);

  const [userEmail, setUserEmail] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {},
    resolver: yupResolver(signupValidationSchema)
  });

  useEffect(() => {
    if (authStorage.loggedIn) {
      router.push('/');
    } else {
      //signOutUser(authStorage, dispatch, router);
    }
  }, []);

  const displayAlertDialog = (message: any, isError: any) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  const generateInputFields = () => {
    return [getUsernameField(), getEmailField(), getPasswordField()];
  };

  const onSubmit = (values: any) => {
    setUserData(null);
    const payload = {
      username: values['username'],
      email: values['email'],
      password: values['password']
    };
    setUserEmail(values['email']);
    signupHandler(payload);
  };

  const signupHandler = async (payload: any) => {
    try {
      const data: any = await signupUser(payload).unwrap();

      let isErrorAlert = false;
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        isErrorAlert = true;
        displayAlertDialog(traceError, isErrorAlert);
      } else {
        displayAlertDialog('Signed up successfully', isErrorAlert);
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

  const displaySubmitButton = (isFetching: any, userData: any) => {
    let endIcon = null;
    endIcon = isFetching && (
      <CircularProgress size={16} sx={{ color: 'white' }} />
    );
    if (userData) {
      endIcon = <CheckOutlined fontSize="small" />;
    }
    return (
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        size="large"
        endIcon={endIcon}
        sx={{ mt: 2 }}
      >
        Sign up
      </Button>
    );
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
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
        displayButton={
          alertMessage === 'user with this email address already exists.'
            ? true
            : false
        }
        onButtonClick={resendActivationLinkHandler}
        isError={isErrorAlert}
      />
      <AuthenticationLayout
        fields={generateInputFields()}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      >
        <Stack spacing={2}>
          {displaySubmitButton(isFetching, userData)}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.main
                  }}
                  variant="body2"
                >
                  {'Already have an account? Sign in'}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Stack>
      </AuthenticationLayout>
    </>
  );
};

SignupPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default SignupPage;
