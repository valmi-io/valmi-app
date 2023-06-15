/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 13th 2023, 8:37:39 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import Head from '@/components/PageHead';
import { NextPageWithLayout } from '../_app';
import BaseLayout from '../../src/layouts/BaseLayout';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useLazyLoginAndFetchWorkSpacesQuery } from '../../src/store/api/apiSlice';
import authStorage from '../../src/utils/auth-storage';
import { useRouter } from 'next/router';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { AppDispatch } from '../../src/store/store';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../src/store/reducers/user';
import { initialiseAppState } from '../../src/utils/login-utils';
import AuthenticationLayout from '../../src/content/Authentication/AuthenticationLayout';
import { getEmailField, getPasswordField } from '../../src/utils/form-utils';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { signinValidationSchema } from '../../src/utils/validation-schema';
import AlertComponent from '../../src/components/Alert';
import { CheckOutlined } from '@mui/icons-material';
import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '../../src/components/Error/ErrorUtils';
import Link from 'next/link';
import { signOutUser } from '../../src/utils/lib';

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // sign in query
  const [loginAndFetchWorkSpaces, { isFetching }] =
    useLazyLoginAndFetchWorkSpacesQuery();

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const [loginData, setLoginData] = useState(null);

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

  return (
    <>
      <Head title="Login" />
      <AlertComponent
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
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
