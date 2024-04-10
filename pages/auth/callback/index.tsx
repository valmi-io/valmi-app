/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { hasErrorsInData } from '@components/Error/ErrorUtils';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

const OAuthRedirectPage = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  /** Redux store */
  const connection_flow = useSelector((state: RootState) => state.connectionFlow);
  const { flowState: {} = {} } = connection_flow;

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  useEffect(() => {
    if (router?.query) {
      const { provider = '', access_token = '' } = router.query;
      if (provider) {
        if (provider === 'facebook') {
          const data = {
            config: {
              credentials: {
                access_token: access_token,
                client_id: 'AUTH_FACEBOOK_CLIENT_ID',
                client_secret: 'AUTH_FACEBOOK_CLIENT_SECRET'
              }
            }
          };
          getFbLongLivedToken(``, 'POST', data);
        } else {
          redirectToCreateConnection({
            oAuthParams: router.query
          });
        }
      }
    }
  }, [router]);

  const getFbLongLivedToken = async (url: any, method: any, data: any) => {
    const { workspaceId = '' } = appState || {};

    const { oauth_keys = 'private', type = '' } = connection_flow?.flowState?.selected_connector ?? {};

    let obj = {
      workspace: workspaceId,
      connector: type,
      oauth_keys: oauth_keys,
      accessToken: data?.config?.credentials?.access_token ?? ''
    };

    let state = encodeURIComponent(JSON.stringify(obj));

    try {
      const response = await axios.get('/api/getFbLongLivedToken', { params: { state: state } });

      const result = response.data;

      if (hasErrorsInData(result)) {
        // TODO: Handle this error if needed.
        dispatch(
          setConnectionFlow({
            ...connection_flow.flowState,
            oauth_error: 'oautherror'
          })
        );
        redirectToCreateConnection({ oAuthParams: {} });
      } else {
        const oAuthParams = {
          ...router.query,
          long_term_acccess_token: result.access_token
        };
        redirectToCreateConnection({ oAuthParams });
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      // store error in redux store
      dispatch(
        setConnectionFlow({
          ...connection_flow.flowState,
          oauth_error: 'oautherror'
        })
      );
      redirectToCreateConnection({ oAuthParams: {} });
    }
  };

  const redirectToCreateConnection = ({ oAuthParams }: any) => {
    const { workspaceId = '' } = appState || {};

    // store oAuthparams in redux store
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,
        oauth_params: oAuthParams,
        oauth_error: ''
      })
    );

    // navigate to create connection page
    router.push(`/spaces/${workspaceId}/connections/create`);
  };
};

export const getOAuthParams = (params: any) => {
  const oAuthParams = params || {};

  const { provider = '' } = oAuthParams;
  switch (provider) {
    case 'facebook':
      return getFacebookOAuthParams(oAuthParams);
    case 'google':
      return getGoogleOAuthParams(oAuthParams);
    case 'hubspot':
      return getHubspotOAuthParams(oAuthParams);
    case 'slack':
      return getSlackOAuthParams(oAuthParams);
    case 'shopify':
      return getShopifyOAuthParams(oAuthParams);
    default:
      return { ...oAuthParams };
  }
};

const getFacebookOAuthParams = (oAuthParams: any) => {
  return {
    ...oAuthParams,
    app_id: 'AUTH_FACEBOOK_CLIENT_ID',
    app_secret: 'AUTH_FACEBOOK_CLIENT_SECRET'
  };
};

const getSlackOAuthParams = (oAuthParams: any) => {
  return {
    ...oAuthParams,
    client_id: 'AUTH_SLACK_CLIENT_ID',
    client_secret: 'AUTH_SLACK_CLIENT_SECRET'
  };
};

const getGoogleOAuthParams = (oAuthParams: any) => {
  return {
    ...oAuthParams,
    client_id: 'AUTH_GOOGLE_CLIENT_ID',
    client_secret: 'AUTH_GOOGLE_CLIENT_SECRET',
    developer_token: 'AUTH_GOOGLE_DEVELOPER_TOKEN'
  };
};

const getHubspotOAuthParams = (oAuthParams: any) => {
  return {
    ...oAuthParams,
    client_id: 'AUTH_HUBSPOT_CLIENT_ID',
    client_secret: 'AUTH_HUBSPOT_CLIENT_SECRET'
  };
};

const getShopifyOAuthParams = (oAuthParams: any) => {
  return {
    ...oAuthParams,
    client_id: 'AUTH_SHOPIFY_CLIENT_ID',
    client_secret: 'AUTH_SHOPIFY_CLIENT_SECRET'
  };
};

export default OAuthRedirectPage;
