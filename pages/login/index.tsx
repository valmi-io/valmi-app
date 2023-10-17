/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { CheckOutlined } from '@mui/icons-material';
import { CircularProgress, Stack, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import AuthenticationLayout from '@content/Authentication/AuthenticationLayout';

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
import authStorage from '@utils/auth-storage';
import { getEmailField, getPasswordField } from '@utils/form-utils';
import { signinValidationSchema } from '@utils/validation-schema';
import { signOutUser } from '@utils/lib';

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

  const { control, handleSubmit } = useForm({
    defaultValues: {},
    resolver: yupResolver(signinValidationSchema)
  });

  useEffect(() => {
    if (authStorage.loggedIn) {
      router.push('/');
    } else {
      signOutUser(authStorage, dispatch, router);
    }
  }, []);

  const displayAlertDialog = (message: any, isError: any) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  const generateInputFields = () => {
    return [getEmailField(), getPasswordField()];
  };

  const onSubmit = (values: any) => {
    const payload = {
      email: values['email'],
      password: values['password']
    };
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

  const displaySubmitButton = (isFetching: any, loginData: any) => {
    let endIcon = null;
    endIcon = isFetching && (
      <CircularProgress size={16} sx={{ color: 'white' }} />
    );
    if (loginData) {
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
        Sign in
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
      <Head title="Login" />
      <AlertComponent
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
        displayButton={alertMessage === 'Unauthorized' ? true : false}
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
          {displaySubmitButton(isFetching, loginData)}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.main
                  }}
                  variant="body2"
                >
                  {"Don't have an account? Sign up"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Stack>
      </AuthenticationLayout>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Login;
