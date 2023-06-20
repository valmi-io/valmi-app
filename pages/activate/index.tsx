/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 23rd 2023, 5:28:02 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import Head from '@/components/PageHead';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import BaseLayout from '../../src/layouts/BaseLayout';
import { RootState } from '../../src/store/reducers';
import { NextPageWithLayout } from '../_app';
import ActivationComponent from '../../src/content/Authentication/ActivationComponent';
import { useLazyResendActivationTokenQuery } from '../../src/store/api/apiSlice';
import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '../../src/components/Error/ErrorUtils';
import { AppDispatch } from '../../src/store/store';
import { setAppState } from '../../src/store/reducers/appFlow';

const ActivatePage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const [sendActivationLink, { isError }] = useLazyResendActivationTokenQuery();

  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');

  const [enableLogin, setEnableLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    displayDialog();
  }, []);

  const displayDialog = () => {
    if (!hasLoginFlowState(appState)) {
      setCardTitle('Please wait...');
      setCardDescription('Please wait...');
      setIsLoading(false);
      router.push('/login');
    } else if (isResendActivationLink(appState)) {
      sendActivationLinkHandler(appState);
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

  const isResendActivationLink = (appState: any) => {
    if (hasLoginFlowState(appState)) {
      const { loginFlowState: { resendActivationLink = false } = {} } =
        appState || {};
      return resendActivationLink;
    }
    return true;
  };

  const sendActivationLinkHandler = async (appState: any) => {
    const { loginFlowState: { userEmail = '' } = {} } = appState || {};
    const payload = {
      email: userEmail
    };

    try {
      const data: any = await sendActivationLink(payload).unwrap();
      if (data && hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setCardTitle('Activation Link Failed!');
        setCardDescription(traceError);
      } else {
        setCardTitle('Activation Link Sent!');
        const cardDescription = `We have sent a confirmation email to <strong>${userEmail}</strong>. Please click on the link to continue.`;
        setCardDescription(cardDescription);
      }
    } catch (error) {
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};

      setCardTitle('Activation Link Failed!');
      setCardDescription(message);
    }
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: {
          ...appState.loginFlowState,
          resendActivationLink: false
        }
      })
    );
    setIsLoading(false);
  };

  return (
    <>
      <Head title="Activate" />

      <ActivationComponent
        isLoading={isLoading}
        cardTitle={cardTitle}
        cardDescription={cardDescription}
        enableLogin={enableLogin}
        isError={isError}
      />
    </>
  );
};

ActivatePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ActivatePage;
