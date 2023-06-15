/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 23rd 2023, 5:28:02 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import Head from '@/components/PageHead';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import BaseLayout from '../../src/layouts/BaseLayout';
import { RootState } from '../../src/store/reducers';
import { NextPageWithLayout } from '../_app';
import ActivationComponent from '../../src/content/Authentication/ActivationComponent';

const ActivatePage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');

  const [enableLogin, setEnableLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    displayDialog();
  }, []);

  const displayDialog = () => {
    if (!hasLoginFlowState(appState)) {
      setCardTitle('Verifying...');
      setCardDescription('Please wait...');
      setIsLoading(false);
      router.push('/login');
    } else {
      const {
        loginFlowState: { userEmail, isLoggedIn = false }
      } = appState;
      let cardTitle = '';
      let cardDescription = '';
      if (isLoggedIn) {
        cardTitle = 'Congratulations';
        cardDescription = `Your account has been activated. You can now log in to your account.`;
        setEnableLogin(true);
      } else {
        cardTitle = 'Email Sent!';
        cardDescription = `We have sent a confirmation email to <strong>${userEmail}</strong>. Please click on the link to continue.`;
      }
      setCardTitle(cardTitle);
      setCardDescription(cardDescription);

      setIsLoading(false);
    }
  };

  const hasLoginFlowState = (appState: any) => {
    const { loginFlowState = {} } = appState;
    if (Object.keys(loginFlowState).length < 1) return false;
    return true;
  };

  return (
    <>
      <Head title="Activate" />

      <ActivationComponent
        isLoading={isLoading}
        cardTitle={cardTitle}
        cardDescription={cardDescription}
        enableLogin={enableLogin}
      />
    </>
  );
};

ActivatePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ActivatePage;
