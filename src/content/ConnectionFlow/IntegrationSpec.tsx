import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import SubmitButton from '@/components/SubmitButton';
import { OAuthContext } from '@/contexts/OAuthContext';
import { RootState } from '@/store/reducers';
import {
  getCredentialObjKey,
  getSelectedConnectorKey,
  getShopifyIntegrationType,
  isConnectionAutomationFlow
} from '@/utils/connectionFlowUtils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { jsonFormValidator } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { isObjectEmpty } from '@/utils/lib';

const IntegrationSpec = ({
  error,
  traceError,
  isLoading,
  specData,
  handleSubmit,
  status
}: {
  error: any;
  traceError: any;
  isLoading: boolean;
  specData: any;
  status: string;
  handleSubmit: (payload: any) => void;
}) => {
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '', oauth_params = {} } = selectedConnector;

  const config = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config ?? {};

  let initialData = {};

  if (type === getShopifyIntegrationType()) {
    initialData = {
      credentials: {
        auth_method: 'api_password'
      }
    };
  }

  if (connectionDataFlow.entities[getCredentialObjKey(type)]?.config) {
    initialData = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config;
  }

  const [data, setData] = useState<any>(initialData);

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days', 'auth_method'] });

  let { oAuthConfigData, setOAuthConfigData, setIsOAuthStepDone } = useContext(OAuthContext);

  // run this effect as initially the credentials will be empty, upon redirecting after oAuth, credentials other and form fields are filled and will be available in formValues
  useEffect(() => {
    if (specData && !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)) {
      const formDataFromStore = connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues || {};
      setData(formDataFromStore);
    }
  }, [connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues]);

  const handleFormChange = async ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);

    let formData = { ...oAuthConfigData, formValues: data };
    await setOAuthConfigData(formData);
  };

  const getButtonTitle = () => {
    return isConnectionAutomationFlow({ mode, type }) ? 'Create' : 'Check';
  };

  const renderComponent = () => {
    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isLoading) {
      return <SkeletonLoader loading={isLoading} />;
    }

    if (specData) {
      const schema: any = specData?.spec?.connectionSpecification ?? {};

      const { valid, errors } = jsonFormValidator(schema, data);

      return (
        <>
          <JsonForms
            readonly={status === 'submitting'}
            schema={schema}
            data={data}
            renderers={customRenderers}
            cells={materialCells}
            onChange={handleFormChange}
          />
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <SubmitButton
              buttonText={getButtonTitle()}
              data={status === 'success'}
              isFetching={status === 'submitting'}
              disabled={!valid || status === 'submitting'}
              onClick={() => handleSubmit(data)}
            />
          </Stack>

          {/* <ConnectionCheck key={'ConnectionCheck'} state={state} isDiscovering={isDiscovering} /> */}
        </>
      );
    }
  };

  return <>{renderComponent()}</>;
};

export default IntegrationSpec;
