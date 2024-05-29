import { setEntities } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import { getSelectedConnectorKey } from '@/utils/connectionFlowUtils';

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

export const updateOAuthStateInRedux = ({
  dispatch,
  connectionDataFlow,
  oAuthParams,
  oAuthError
}: {
  dispatch: AppDispatch;
  connectionDataFlow: any;
  oAuthParams: any;
  oAuthError: any;
}) => {
  const entitiesInStore = connectionDataFlow?.entities ?? {};

  // store oAuthparams in redux store
  const obj = {
    ...entitiesInStore,
    [getSelectedConnectorKey()]: {
      ...connectionDataFlow.entities[getSelectedConnectorKey()],
      oauth_params: oAuthParams,
      oauth_error: oAuthError
    }
  };

  dispatch(setEntities(obj));
};
