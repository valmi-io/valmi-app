/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 8:09:26 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useState } from 'react';

import BaseLayout from '@layouts/BaseLayout';

import Head from '@components/PageHead';

import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import AuthenticationLayout from '@/content/Authentication/AuthenticationLayout';
import AuthenticationForm from '@/content/Authentication/AuthenticationForm';
import { generateConfirmPasswordResetFields } from '@/content/Authentication/AuthenticationFormUtils';
import { useAuthenticationForm } from '@/content/Authentication/useAuthenticationForm';
import { confirmPasswordResetValidationSchema } from '@/utils/validation-schema';
import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';
import { FormStatus } from '@/utils/form-utils';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useLazyConfirmPasswordResetQuery } from '@/store/api/apiSlice';

const PageLayout = () => {
  // Get type from router
  const router = useRouter();
  const { uid, tid } = router.query;
  if (!uid && !tid) return <></>;
  else return <ResetPasswordConfirmationPage uid={uid} tid={tid} />;
};

const ResetPasswordConfirmationPage = ({
  uid,
  tid
}: {
  uid: string | string[] | undefined;
  tid: string | string[] | undefined;
}) => {
  const router = useRouter();

  // reset password query
  const [confirmPasswordReset, { isFetching }] = useLazyConfirmPasswordResetQuery();

  const { control, handleSubmit } = useAuthenticationForm(confirmPasswordResetValidationSchema);

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
      new_password: values['password'],
      uid: uid,
      token: tid
    };

    handleConfirmPasswordReset(payload);
  };

  const handleConfirmPasswordReset = async (payload: any) => {
    try {
      const data: any = await confirmPasswordReset(payload).unwrap();

      if (hasErrorsInData(data)) {
        setFormState((state) => ({
          ...state,
          status: 'error'
        }));

        const traceError = getErrorsInData(data);

        handleAlertOpen({ message: traceError, alertType: 'error' });
      } else {
        handleAlertOpen({ message: 'Password Changed', alertType: 'success' });

        const title = 'Password Changed!';
        const description = `Your password has been changed successfully.`;

        setFormState((state) => ({
          ...state,
          status: 'success',
          title: title,
          description: description
        }));
      }
    } catch (error) {
      setFormState((state) => ({
        ...state,
        status: 'error'
      }));
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};

      handleAlertOpen({ message: message, alertType: 'error' });
    }
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

  const handleOnClick = () => {
    router.push('/login');
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

        <Button size="large" variant="contained" onClick={handleOnClick}>
          Click here to login
        </Button>
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
            fields={generateConfirmPasswordResetFields()}
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

PageLayout.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PageLayout;
