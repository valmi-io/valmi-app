/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { getConnectorImage, isObjectEmpty } from '@utils/lib';

export const getConnectorDocumentationUrl = (data: any) => {
  const { spec: { documentationUrl = '' } = {} } = data || {};
  return documentationUrl;
};

export const isConnectorRequiresOAuth = (data: any) => {
  const { spec: { authSpecification = {} } = {} } = data || {};
  if (!isObjectEmpty(authSpecification)) return true;
  return false;
};

export const hasAuthorizedOAuth = (oAuthParams: any, isEditableFlow: boolean) => {
  //TODO: HACK - to check if the user has already authorized based on isEditableFlow
  return !isObjectEmpty(oAuthParams) || isEditableFlow ? true : false;
};

export const getOauthRoute = ({ oAuth }: any) => {
  if (oAuth) return `/api/oauth2/login/${oAuth}`;
  return '';
};

export const getOauthImage = ({ oAuth }: any) => {
  switch (oAuth) {
    case 'facebook':
      return getConnectorImage('facebook');
    case 'google':
      return getConnectorImage('google');
    case 'slack':
      return getConnectorImage('slack');
    case 'hubspot':
      return getConnectorImage('hubspot');
    case 'shopify':
      return getConnectorImage('shopify');
    default:
      return '';
  }
};

export const getOauthColorCode = ({ oAuth }: any) => {
  switch (oAuth) {
    case 'facebook':
      return '#5890FF';
    case 'google':
      return '#4285F4';
    case 'slack':
      return '#4A154B';
    case 'hubspot':
      return '#fff';
    case 'shopify':
      return '#fff';
    default:
      return '';
  }
};

export const getOauthLoginText = ({ oAuth }: any) => {
  switch (oAuth) {
    case 'facebook':
      return 'Login with Facebook';
    case 'google':
      return 'Sign in with Google';
    case 'slack':
      return 'Sign in with Slack';
    case 'hubspot':
      return 'Sign in with Hubspot';
    case 'shopify':
      return 'Shopify';
    default:
      return '';
  }
};
