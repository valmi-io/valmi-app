import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import SubmitButton from '@/components/SubmitButton';
import { OAuthContext } from '@/contexts/OAuthContext';
import { RootState } from '@/store/reducers';
import {
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
  specData
}: {
  error: any;
  traceError: any;
  isLoading: boolean;
  specData: any;
}) => {
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '' } = selectedConnector;

  let initialData = {};

  if (type === getShopifyIntegrationType()) {
    initialData = {
      credentials: {
        auth_method: 'api_password'
      }
    };
  }

  const [data, setData] = useState<any>(initialData);

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days', 'auth_method'] });

  let { oAuthConfigData, setOAuthConfigData, setIsOAuthStepDone } = useContext(OAuthContext);

  const handleFormChange = async ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);

    let formData = { ...oAuthConfigData, formValues: data };
    await setOAuthConfigData(formData);
  };

  console.log('data:_', data);

  const getButtonTitle = () => {
    return isConnectionAutomationFlow({ mode, type }) ? 'Create' : 'Check';
  };

  const handleSubmit = () => {
    // setState((state) => ({
    //   ...state,
    //   status: 'submitting'
    // }));

    const payload = {
      config: data
    };

    console.log('handle submit:_', payload);

    // checkConnection(`/workspaces/${wid}/connectors/${type}/check`, 'POST', payload);
  };

  // run this effect as initially the credentials will be empty, upon redirecting after oAuth, credentials other and form fields are filled and will be available in formValues
  useEffect(() => {
    if (specData && !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)) {
      const formDataFromStore = connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues || {};
      setData(formDataFromStore);
    }
  }, [connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues]);

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

      const { valid } = jsonFormValidator(schema, data);

      return (
        <>
          <JsonForms
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
              data={false}
              isFetching={false}
              disabled={!valid}
              onClick={handleSubmit}
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
