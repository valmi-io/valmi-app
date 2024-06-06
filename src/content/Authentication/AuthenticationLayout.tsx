// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 2:52:54 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState } from 'react';
import { Box, styled, Stack, Button } from '@mui/material';

import AuthenticationFormFooter from '@/content/Authentication/AuthenticationFormFooter';
import { GoogleSignInButton } from '@/components/AuthButtons';
import { formValidationMode, jsonFormValidator } from '@/utils/form-utils';
import { setAuthMetaCookie } from '@/lib/cookies';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { AppFlowState, setAppState } from '@/store/reducers/appFlow';
import { RootState } from '@/store/reducers';
import { signIn } from 'next-auth/react';
import AuthenticationFormHeader from '@/content/Authentication/AuthenticationFormHeader';
import AuthenticationForm from '@/content/Authentication/AuthenticationForm';
import { loginFormSchema } from '@/utils/login-utils';
import PrivacyPolicy from '@/content/Authentication/PrivacyPolicy';

const ContainerLayout = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '364.25px',
  minWidth: '440px',
  maxWidth: '648px',
  padding: 0,
  gap: theme.spacing(2),
  border: '1px solid rgba(0, 0, 0, 0.25)',
  flexGrow: 1
}));

const DetailBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  Width: '100%',
  height: '100%',
  padding: theme.spacing(2, 8),
  gap: theme.spacing(1)
}));

const AuthenticationLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const initialData = {};
  const [formData, setFormData] = useState<any>(initialData);
  const [isUserNew, setIsUserNew] = useState<boolean>(true);

  const [formValidationState, setFormValidationState] = useState<formValidationMode>('ValidateAndHide');

  /**
   * Validates the user-submitted data (`formData`) against the defined schema (`schema`)
   * and returns an object containing a `valid` flag and any encountered `errors`.
   */
  const { valid, errors } = jsonFormValidator(loginFormSchema, formData);

  /**
   * Updates the `formData` state with the new data received from the JSONForms component
   * when the user interacts with the form.
   */
  const handleFormDataChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setFormData(data);
  };

  /**
   * Handles the click event on the login button. It checks user type, form validation,
   * and promotion selection (for new users) before triggering the login flow (`handleLogin`).
   */
  const handleLoginClick = () => {
    if (!isUserNew) {
      handleLogin();
      return;
    }
    if (!valid) {
      setFormValidationState('ValidateAndShow');
      return;
    }

    if (!formData.promotion) {
      setFormValidationState('ValidateAndShow');
      return;
    }
    handleLogin();
  };

  /**
   * Performs the actual login process. It includes setting the authentication meta cookie,
   * updating the login flow state in Redux, and calling the `signIn` function from
   * `next-auth/react` to initiate user sign-in.
   */
  const handleLogin = async () => {
    try {
      await setAuthMetaCookie(formData);
      updateLoginFlowState();

      signIn('google', {
        callbackUrl: '/'
      });
    } catch (error) {
      // console.error('Error during login:', error);
    }
  };

  /**
   * Dispatches a Redux action to update the `loginFlowState` in the app state
   * with the value `'INITIALIZED'`.
   */
  const updateLoginFlowState = () => {
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: 'INITIALIZED'
      })
    );
  };

  /**
   * Toggles the user mode between "Sign Up" and "Sign In".
   * This function updates the `isUserNew` state & resets formData state, which controls the displayed form
   * and button options based on whether the user is a new user or an existing user.
   */
  const handleLoginModes = () => {
    setFormData({});
    setFormValidationState('ValidateAndHide');
    setIsUserNew(!isUserNew);
  };

  return (
    <ContainerLayout>
      <DetailBox sx={isUserNew ? { justifyContent: 'center' } : { justifyContent: 'space-evenly' }}>
        {/** Header */}
        <AuthenticationFormHeader isUserNew={isUserNew} />

        {isUserNew && (
          <AuthenticationForm
            key={`${isUserNew ? 'Login' : 'Signup'}Form`}
            formData={formData}
            formValidationState={formValidationState}
            handleFormDataChange={handleFormDataChange}
            schema={loginFormSchema}
          />
        )}

        <Stack
          sx={{
            width: '100%'
          }}
        >
          <GoogleSignInButton onClick={handleLoginClick} />
          <Button onClick={handleLoginModes} sx={{ alignSelf: 'flex-end', padding: 1 }}>
            <AuthenticationFormFooter
              footerText={isUserNew ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            />
          </Button>
        </Stack>

        <PrivacyPolicy isUserNew={isUserNew} />
      </DetailBox>
    </ContainerLayout>
  );
};

export default AuthenticationLayout;
