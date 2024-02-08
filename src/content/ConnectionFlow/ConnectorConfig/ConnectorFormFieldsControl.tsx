/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 9:51:20 am
 * Author: Nagendra S @ valmi.io
 */

import FormField from '@/components/FormInput/FormField';
import {
  processFields,
  getOauthRoute,
  hasAuthorizedOAuth
} from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { FormContainer } from '@/layouts/FormLayout';
import { getOAuthParams } from '@/pagesauth/callback';
import { RootState } from '@/store/reducers';
import { setConnectionFlow } from '@/store/reducers/connectionFlow';
import { generateConfigFromSpec } from '@/utils/connection-utils';
import { FormObject } from '@/utils/form-utils';
import { getBaseRoute } from '@/utils/lib';
import { TData } from '@/utils/typings.d';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const ConnectorFormFieldsControl = (props: any) => {
  const { data, keys, control, handleSubmit, onSubmit, formValues } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { flowState: { selected_connector = null, oauth_params = {}, oauth_error = '', connector_spec = null } = {} } =
    connection_flow;

  const workspaceId = useSelector((state: RootState) => state.appFlow.appState.workspaceId);

  const fields = data ? processFields(data) : [];

  const handleOAuthButtonClick = async (data: any) => {
    const { oauth_keys = 'private' } = selected_connector;

    const values = formValues;
    let combinedValues = { ...values, ...getOAuthParams(oauth_params) };

    let config = generateConfigFromSpec(connector_spec, combinedValues);
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,
        connector_config: config,
        connection_title: values.title
      })
    );

    if (data.oAuthProvider) {
      // getOauthRoute -> returns /api/login/facebook which is defined in pages/api
      const oAuthRoute = getOauthRoute({ oAuth: data.oAuthProvider });
      if (oAuthRoute) {
        let { type = '' } = selected_connector;
        router.push(`${oAuthRoute}?workspace=${workspaceId}&connector=${type}&oauth_keys=${oauth_keys}`);
      }
    }
  };

  const handleOnConfigureButtonClick = () => {
    let { type = '' } = selected_connector;

    const connector = type.split('_')[0] ?? '';

    type = type.split('_')[1];

    router.push(
      `${getBaseRoute(workspaceId as string)}/oauth-apps/${type.toLowerCase()}?connector=${connector.toLowerCase()}`
    );
  };

  return (
    <FormContainer>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',

          '& .MuiTextField-root': {
            my: 1,
            width: '100%'
          }
        }}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {fields.map((field: FormObject) => {
          return (
            <FormField
              key={field.label}
              {...field}
              control={control}
              selectedConnector={selected_connector?.display_name ?? ''}
              hasAuthorizedOAuth={hasAuthorizedOAuth(oauth_params)}
              oauth_error={oauth_error}
              onClick={handleOAuthButtonClick}
              isConnectorConfigured={isConnectorConfigured({ field, keys })}
              isConfigurationRequired={isConfigurationRequired({ connector: selected_connector })}
              handleOnConfigureButtonClick={handleOnConfigureButtonClick}
            />
          );
        })}
      </Box>
    </FormContainer>
  );
};

export default ConnectorFormFieldsControl;

const isConfigurationRequired = ({ connector }: { connector: ConnectorType }) => {
  const { oauth_keys = 'private' } = connector;

  return oauth_keys === 'private' ? true : false;
};

const isConnectorConfigured = ({ field, keys }: { field: FormObject; keys: TData }) => {
  const { ids = [] } = keys;
  if (field.fieldType !== 'auth') return false;
  return !!ids.length;
};
