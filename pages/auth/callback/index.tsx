import { useEffect } from 'react';

import { NextRouter, useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import { getSelectedConnectorKey } from '@/utils/connectionFlowUtils';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { isObjectEmpty } from '@/utils/lib';
import { apiRoutes, redirectToCreateConnection, redirectToHomePage } from '@/utils/router-utils';
import { updateOAuthStateInRedux } from '@/utils/oauth-utils';

const handleFacebookLogin = async (queryParams: any, successCb: (res: any) => void, errorCb: (err: any) => void) => {
  const URL = apiRoutes['fbTokenURL'];
  try {
    const response = await axios.get(URL, { params: { state: queryParams } });

    const result = response?.data ?? {};
    if (hasErrorsInData(result)) {
      const traceError = getErrorsInData(result);
      errorCb(traceError);
    } else {
      successCb(result);
    }
  } catch (error) {
    errorCb(error);
  }
};

const OAuthCallbackPage = () => {
  const router = useRouter();

  const dispatchToStore = useDispatch<AppDispatch>();

  /** Redux store */
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { oauth_params: oAuthParams = {}, oauth_error: oAuthError = '' } = selectedConnector;

  const { workspaceId = '' } = useWorkspaceId();

  useEffect(() => {
    if (router.isReady) {
      if (router?.query && !isObjectEmpty(router.query)) {
        handleQueryParams(router, dispatchToStore, router.query, workspaceId, selectedConnector, connectionDataFlow);
      } else {
        redirectToHomePage(workspaceId, router);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if ((oAuthParams && !isObjectEmpty(oAuthParams)) || oAuthError) {
      redirectToCreateConnection({
        router: router,
        wid: workspaceId
      });
    }
  }, [oAuthParams, oAuthError]);

  const handleQueryParams = (
    router: NextRouter,
    dispatch: AppDispatch,
    params: any,
    wid: string,
    selectedConnector: any,
    connectionDataFlow: any
  ) => {
    const { provider = '', access_token = '' } = params ?? {};
    if (provider && wid) {
      if (provider === 'facebook') {
        getFbLongLivedToken(router, wid, access_token, selectedConnector);
      } else {
        updateOAuthStateInRedux({
          oAuthParams: router.query,
          oAuthError: '',
          connectionDataFlow: connectionDataFlow,
          dispatch: dispatch
        });
      }
    } else {
      redirectToHomePage(workspaceId, router);
    }
  };

  const getFbLongLivedToken = async (router: NextRouter, wid: string, access_token: string, selectedConnector: any) => {
    const { oauth_keys = 'private', type = '' } = selectedConnector ?? {};

    let obj = {
      workspace: wid,
      connector: type,
      oauth_keys: oauth_keys,
      accessToken: access_token ?? ''
    };

    let state = encodeURIComponent(JSON.stringify(obj));

    await handleFacebookLogin(state, (res) => handleFacebookLoginSuccess(router, res), handleFacebookLoginError);
  };

  const handleFacebookLoginSuccess = (router: NextRouter, res: any) => {
    const oAuthParams = {
      ...router.query,
      long_term_acccess_token: res.access_token
    };

    updateOAuthStateInRedux({
      oAuthParams: oAuthParams,
      oAuthError: '',
      connectionDataFlow: connectionDataFlow,
      dispatch: dispatchToStore
    });
  };

  const handleFacebookLoginError = (err: any) => {
    updateOAuthStateInRedux({
      oAuthParams: {},
      oAuthError: err,
      connectionDataFlow: connectionDataFlow,
      dispatch: dispatchToStore
    });
  };

  return <></>;
};

export default OAuthCallbackPage;
