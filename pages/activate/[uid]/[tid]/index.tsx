/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:51:52 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import BaseLayout from '@layouts/BaseLayout';

import ActivationComponent from '@content/Authentication/ActivationComponent';

import Head from '@components/PageHead';
import { getErrorsInErrorObject } from '@components/Error/ErrorUtils';

import { useLazyActivateUserQuery } from '@store/api/apiSlice';

const ActivationConfirmationPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { uid, tid } = router.query;

  const [activateUser, { data, isFetching, isError, error }] =
    useLazyActivateUserQuery();

  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');

  const [enableLogin, setEnableLogin] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    activateUser({
      uid,
      token: tid
    });
  }, [router.isReady]);

  useEffect(() => {
    if (data === null) {
      const cardTitle = 'Congratulations';
      const cardDescription = `Your account has been activated. You can now log in to your account.`;
      setCardTitle(cardTitle);
      setCardDescription(cardDescription);
      setEnableLogin(true);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errors = getErrorsInErrorObject(error);

      const { message = 'unknown' } = errors || {};

      setCardTitle('Unable to Activate');
      setCardDescription(message);
      setEnableLogin(true);
    }
  }, [isError]);

  return (
    <>
      <Head title="Activate" />

      <ActivationComponent
        isLoading={isFetching}
        cardTitle={cardTitle}
        cardDescription={cardDescription}
        enableLogin={enableLogin}
        isError={isError}
      />
    </>
  );
};

ActivationConfirmationPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ActivationConfirmationPage;
