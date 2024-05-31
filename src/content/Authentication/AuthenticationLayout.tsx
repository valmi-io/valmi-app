// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 2:52:54 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState } from 'react';
import { Box, styled, Stack, Typography, Paper, Button, Link } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import AuthenticationFormFooter from '@/content/Authentication/AuthenticationFormFooter';
import { GoogleSignInButton } from '@/components/AuthButtons';
import { formValidationMode, jsonFormValidator } from '@/utils/form-utils';
import { setAuthMetaCookie } from '@/lib/cookies';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { AppFlowState, setAppState } from '@/store/reducers/appFlow';
import { RootState } from '@/store/reducers';
import { signIn } from 'next-auth/react';
import { JsonFormsWrapper } from '@/components/JsonFormsWrapper';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    promotion: {
      type: 'boolean',
      title: 'Check to receive latest product updates over email',
      const: true,
      description: 'Select this checkbox to receive emails about new product features and announcements'
    },
    role: {
      type: 'string',
      title: 'You are part of',
      enum: ['Engineering', 'Marketing', 'Other'],
      description: "Select your role from the dropdown menu. If your role isn't listed, choose 'Other'"
    }
  },
  required: ['promotion', 'role']
};

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

const TextLayout = styled(Typography)(({ theme }) => ({
  maxWidth: '520px'
}));

const FormLayout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: theme.spacing(1, 0),
  maxWidth: '520px'
}));

const AuthenticationLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const initialData = {};
  const [formData, setFormData] = useState<any>(initialData);
  const [isUserNew, setIsUserNew] = useState<boolean>(true);

  const [formValidationState, setFormValidationState] = useState<formValidationMode>('ValidateAndHide');

  /**
   * Retrieves custom renderers for the JSONForms component based on the provided configuration
   * (e.g., hiding specific fields).
   */
  const handleFormRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  /**
   * Validates the user-submitted data (`formData`) against the defined schema (`schema`)
   * and returns an object containing a `valid` flag and any encountered `errors`.
   */
  const { valid, errors } = jsonFormValidator(schema, formData);

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
    setIsUserNew(!isUserNew);
  };

  return (
    <ContainerLayout>
      <DetailBox sx={isUserNew ? { justifyContent: 'center' } : { justifyContent: 'space-evenly' }}>
        {/** valmi - logo */}
        <Stack alignItems="center">
          <ImageComponent
            src={'/images/valmi_logo_text_black.svg'}
            alt="Logo"
            size={ImageSize.logo}
            style={{ height: '55px', width: '273px' }}
          />
        </Stack>
        <TextLayout variant="body1">
          {isUserNew
            ? 'Create your free Valmi account using your Google account. Sync your eCommerce data to Google Sheets, analyze and engage with your customers.'
            : 'Sync your eCommerce data to Google Sheets, analyze and engage with your customers.'}
        </TextLayout>

        {isUserNew ? (
          <FormLayout key={`${isUserNew ? 'Login' : 'Signup'}Form`}>
            <JsonFormsWrapper
              formValidationState={formValidationState}
              onChange={handleFormDataChange}
              renderers={handleFormRenderers}
              schema={schema}
              data={formData}
            />
          </FormLayout>
        ) : null}
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
        <Stack sx={{ alignSelf: 'start' }}>
          <Typography variant="body1">
            By signing {isUserNew ? 'up' : 'in'}, you agree to Valmi.io's
            <Link sx={{ ml: 1 }} href="https://www.valmi.io/privacy-policy">
              Privacy Policy
            </Link>{' '}
            .
          </Typography>
        </Stack>
      </DetailBox>
    </ContainerLayout>
  );
};

export default AuthenticationLayout;
