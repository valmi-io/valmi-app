/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { createNewField } from '../../../utils/form-utils';
import { getConnectorImage } from '../../../utils/lib';

export const processFields = (data: any) => {
  const {
    spec: {
      authProvider = '',
      authSpecification = {},
      connectionSpecification: { properties = {}, required = [] } = {}
    } = {}
  } = data || {};

  const fieldsArr = Object.keys(properties).length
    ? Object.keys(properties).map((key) => {
        const name = key;
        const label = properties[key].title ? properties[key].title : key;
        const type = properties[key].type ? properties[key].type : 'Type';
        const description = properties[key].description
          ? properties[key].description
          : '';
        const enumFlag = !!properties[key].enum;
        const isSecretKey = !!properties[key].airbyte_secret;
        const enumValue = properties[key].enum || null;
        const isOAuth =
          label.startsWith('Authentication') &&
          Object.keys(authSpecification).length > 0;

        const oAuthProvider = !authProvider.trim() ? 'provider' : authProvider;
        const isRequired = required.includes(key);
        const fieldType = getFieldType({
          hasOAuth: isOAuth,
          enumFlag,
          isSecretKey,
          type
        });

        return createNewField({
          name,
          label,
          type,
          description,
          enumValue: enumValue,
          oAuthProvider,
          required: isRequired,
          disabled: false,
          fieldType
        });
      })
    : [];

  const connectorNameField = createNewField({
    name: 'title',
    label: 'Connection name',
    type: 'string',
    description: 'Enter a name to help you identify this connector',
    enumValue: null,
    oAuthProvider: '',
    required: true,
    disabled: false,
    fieldType: 'string'
  });

  const connectorTypeField = createNewField({
    name: 'connector_type',
    label: 'Connector type',
    type: 'string',
    description: 'Select a type for this connection',
    enumValue: null,
    oAuthProvider: '',
    required: false,
    disabled: true,
    fieldType: 'string'
  });

  const connectorFieldsArr = [
    { ...connectorTypeField },
    { ...connectorNameField },
    ...fieldsArr
  ];

  return connectorFieldsArr;
};

export const getConnectorDocumentationUrl = (data: any) => {
  const { spec: { documentationUrl = '' } = {} } = data || {};
  return documentationUrl;
};

export const isConnectorRequiresOAuth = (data: any) => {
  const { spec: { authSpecification = {} } = {} } = data || {};
  if (Object.keys(authSpecification).length > 0) return true;
  return false;
};

export const hasAuthorizedOAuth = (oAuthParams: any) => {
  return Object.keys(oAuthParams).length > 0 ? true : false;
};

const getFieldType = ({ hasOAuth, enumFlag, isSecretKey, type }: any) => {
  switch (true) {
    case hasOAuth:
      return 'auth';
    case enumFlag:
      return 'select';
    case isSecretKey:
      return 'password';

    default:
      return type;
  }
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
    default:
      return '';
  }
};
