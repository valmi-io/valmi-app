// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:53 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import SkeletonLoader from '@components/SkeletonLoader';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import ErrorComponent, { ErrorStatusText } from '@components/Error';

import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';
import { useLazyFetchIntegrationSpecQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import FormLayout from '@/layouts/FormLayout';
import ConnectorInstructions from '@/content/ConnectionFlow/ConnectorConfig/ConnectorInstructions';
import ConnectorFormFieldsControl from '@/content/ConnectionFlow/ConnectorConfig/ConnectorFormFieldsControl';
import { useLazyGetOAuthApiConfigQuery } from '@/store/api/oauthApiSlice';
import { JsonForms } from '@jsonforms/react';
import FormControlComponent from '@/components/FormControlComponent';
import { FormStatus } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { useWizard } from 'react-use-wizard';
import { setEntities } from '@/store/reducers/connectionDataFlow';

// interface ConnectorConfigProps {
//   control: any;
//   handleSubmit: any;
//   formValues: any;
//   resetForm: any;
//   setValue: any;
//   onSubmit: (formData: any) => void;
//   handleFormStatus: (isFetching: boolean) => void;
// }

let spec = {
  type: 'SPEC',
  spec: {
    documentationUrl: 'https://docs.airbyte.com/integrations/sources/shopify',
    connectionSpecification: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Shopify Source CDK Specifications',
      type: 'object',
      required: ['shop', 'start_date'],
      additionalProperties: true,
      properties: {
        shop: {
          type: 'string',
          title: 'Shopify Store',
          description:
            "The name of your Shopify store found in the URL. For example, if your URL was https://NAME.myshopify.com, then the name would be 'NAME'.",
          order: 1
        },
        credentials: {
          title: 'Shopify Authorization Method',
          description: 'The authorization method to use to retrieve data from Shopify',
          type: 'object',
          order: 2,
          oneOf: [
            {
              title: 'API Password',
              description: 'API Password Auth',
              type: 'object',
              required: ['auth_method', 'api_password'],
              properties: {
                auth_method: { type: 'string', const: 'api_password', order: 0 },
                api_password: {
                  type: 'string',
                  title: 'API Password',
                  description: 'The API Password for your private application in the `Shopify` store.',
                  airbyte_secret: true,
                  order: 1
                }
              }
            },
            {
              type: 'object',
              title: 'OAuth2.0',
              description: 'OAuth2.0',
              required: ['auth_method'],
              properties: {
                auth_method: { type: 'string', const: 'oauth2.0', order: 0 },
                client_id: {
                  type: 'string',
                  title: 'Client ID',
                  description: 'The Client ID of the Shopify developer application.',
                  airbyte_secret: true,
                  order: 1
                },
                client_secret: {
                  type: 'string',
                  title: 'Client Secret',
                  description: 'The Client Secret of the Shopify developer application.',
                  airbyte_secret: true,
                  order: 2
                },
                access_token: {
                  type: 'string',
                  title: 'Access Token',
                  description: 'The Access Token for making authenticated requests.',
                  airbyte_secret: true,
                  order: 3
                }
              }
            }
          ]
        },
        start_date: {
          type: 'string',
          title: 'Replication Start Date',
          description:
            'The date you would like to replicate data from. Format: YYYY-MM-DD. Any data before this date will not be replicated.',
          examples: ['2021-01-01'],
          pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
          order: 3
        }
      }
    },
    advanced_auth: {
      auth_flow_type: 'oauth2.0',
      predicate_key: ['credentials', 'auth_method'],
      predicate_value: 'oauth2.0',
      oauth_config_specification: {
        oauth_user_input_from_connector_config_specification: {
          type: 'object',
          additionalProperties: false,
          properties: { shop: { type: 'string', path_in_connector_config: ['shop'] } }
        },
        complete_oauth_output_specification: {
          type: 'object',
          additionalProperties: false,
          properties: { access_token: { type: 'string', path_in_connector_config: ['credentials', 'access_token'] } }
        },
        complete_oauth_server_input_specification: {
          type: 'object',
          additionalProperties: false,
          properties: { client_id: { type: 'string' }, client_secret: { type: 'string' } }
        },
        complete_oauth_server_output_specification: {
          type: 'object',
          additionalProperties: false,
          properties: {
            client_id: { type: 'string', path_in_connector_config: ['credentials', 'client_id'] },
            client_secret: { type: 'string', path_in_connector_config: ['credentials', 'client_secret'] }
          }
        }
      }
    }
  }
};

type Props = {
  params: any;
};

const ConnectorConfig = ({ params }: Props) => {
  const { wid = '', type = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();

  const { handleStep, activeStep, nextStep } = useWizard();

  let initialData = {};

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  if (connectionDataFlow?.entities[activeStep]?.config) {
    initialData = connectionDataFlow?.entities[activeStep]?.config;
  }

  const { flowState: { selected_connector = null, connector_config = null, connection_title = '' } = {} } =
    connection_flow;

  const [traceError, setTraceError] = useState<any>(null);

  const [data, setData] = useState<any>(initialData);

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  {
    /* query for connector configuration */
  }
  const [fetchIntegrationSpec, { data: specData, isFetching, error }] = useLazyFetchIntegrationSpecQuery();

  // Getting keys for the object
  const [fetchConnectorOAuthConfig, { data: keys, isLoading: isKeysLoading, error: keysError }] =
    useLazyGetOAuthApiConfigQuery();

  useEffect(() => {
    // fetch integration spec

    if (type && wid) {
      if (connectionDataFlow?.entities[activeStep]?.spec) {
        spec = connectionDataFlow?.entities[activeStep]?.spec;
      } else {
        fetchIntegrationSpec({
          type: type,
          workspaceId: wid
        });
      }
    }
  }, [wid, type]);

  // useEffect(() => {
  //   if (selected_connector) {
  //     // reset form if no connector_config in connection_flow
  //     if (!connector_config) {
  //       resetForm({});
  //     } else {
  //       resetForm((formValues) => ({
  //         ...formValues,
  //         ...connector_config,
  //         title: connection_title
  //       }));
  //     }

  // fetchConnectorConfig({
  //   type: selected_connector.type,
  //   workspaceId: workspaceId
  // });

  //     if (selected_connector.oauth_keys === 'private') {
  //       fetchConnectorOAuthConfig({
  //         workspaceId,
  //         type: selected_connector.type
  //       });
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (isFetching || isKeysLoading) {
  //     handleFormStatus(true);
  //   } else {
  //     handleFormStatus(false);
  //   }
  // }, [isFetching, isKeysLoading]);

  useEffect(() => {
    if (specData) {
      if (hasErrorsInData(specData)) {
        const traceError = getErrorsInData(specData);
        setTraceError(traceError);
      }
    }
  }, [specData]);

  const handleSubmit = () => {
    const entities = connectionDataFlow?.entities ?? {};

    const obj = {
      ...entities,
      [activeStep]: {
        config: data,
        spec: spec
      }
    };

    dispatch(setEntities(obj));

    nextStep();
  };

  const handleDelete = () => {
    console.log('handle delete');
  };

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/destination-warehouses`);
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const getDisplayComponent = () => {
    // handle error
    // if (error || keysError) {
    //   return <ErrorComponent error={error || keysError} />;
    // }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isFetching || isKeysLoading) {
      return <SkeletonLoader loading={isFetching || isKeysLoading} />;
    }

    if (spec) {
      const schema = spec?.spec?.connectionSpecification ?? {};

      return (
        <FormControlComponent
          key={`SourceConfig`}
          deleteTooltip="Delete source"
          editing={false}
          onDelete={handleDelete}
          onFormChange={handleFormChange}
          onSubmitClick={handleSubmit}
          isDeleting={false}
          status={status}
          error={false}
          jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
          removeAdditionalFields={false}
        />
      );
    }
  };

  return (
    <ConnectorLayout title={`Connect to ${selected_connector ? selected_connector.display_name : 'connector'}`}>
      {getDisplayComponent()}
    </ConnectorLayout>
  );
};

export default ConnectorConfig;
