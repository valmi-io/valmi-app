/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 8:09:26 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useState } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import Head from '@components/PageHead';

import { useLazyResetPasswordQuery } from '@store/api/apiSlice';

import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import AuthenticationLayout from '@/content/Authentication/AuthenticationLayout';
import AuthenticationForm from '@/content/Authentication/AuthenticationForm';
import { generateResetPasswordFields } from '@/content/Authentication/AuthenticationFormUtils';
import { useAuthenticationForm } from '@/content/Authentication/useAuthenticationForm';
import { resetPasswordValidationSchema } from '@/utils/validation-schema';
import { FormStatus } from '@/utils/form-utils';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { queryHandler } from '@/services';

const ResetPasswordPage: NextPageWithLayout = () => {
  // reset password query
  const [resetPassword, { isFetching }] = useLazyResetPasswordQuery();

  const { control, handleSubmit, watch } = useAuthenticationForm(resetPasswordValidationSchema);

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  // form state
  const [formState, setFormState] = useState<{ status: FormStatus; title: string; description: string }>({
    status: 'empty',
    title: '',
    description: ''
  });

  const onSubmit = (values: any) => {
    {
      /** Generate reset Password payload */
    }

    const payload = {
      email: values['email']
    };

    handleResetPassword(payload);
  };

  const successCb = (data: any) => {
    const { email = '' }: { [key: string]: any } = watch();

    handleAlertOpen({ message: 'Email sent', alertType: 'success' });

    const title = 'Reset Password Link Sent!';
    const description = `We have sent a confirmation email to <strong>${email}</strong>. Please click on the link to continue.`;

    setFormState((state) => ({
      ...state,
      status: 'success',
      title: title,
      description: description
    }));
  };

  const errorCb = (error: any) => {
    setFormState((state) => ({
      ...state,
      status: 'error'
    }));
    handleAlertOpen({ message: error, alertType: 'error' });
  };

  const handleResetPassword = async (payload: any) => {
    await queryHandler({ query: resetPassword, payload: payload, successCb, errorCb });
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

  const displayFormSuccessContent = () => {
    return (
      <Stack spacing={4}>
        <Box>
          <Typography align="center" variant="h3">
            {formState.title}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: formState.description }} />
        </Box>
        <Link aria-label={'Not received link'} href={'/signup'} style={{ textDecoration: 'none', alignSelf: 'center' }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main
            }}
            variant="body2"
          >
            {`Didn't receive an email? Signup`}
          </Typography>
        </Link>
      </Stack>
    );
  };

  return (
    <>
      <Head title="ResetPassword" />
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        displayButton={false}
        isError={alertState.type === 'error'}
      />
      {/** Page layout */}
      <AuthenticationLayout>
        {/** Display form */}
        {formState.status === 'success' ? (
          displayFormSuccessContent()
        ) : (
          <AuthenticationForm
            fields={generateResetPasswordFields()}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isFetching={isFetching}
            data={formState.status !== 'error' && formState.status !== 'empty'}
            buttonText={'Submit'}
          />
        )}
      </AuthenticationLayout>
    </>
  );
};

ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ResetPasswordPage;
