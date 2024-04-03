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

// interface ConnectorConfigProps {
//   control: any;
//   handleSubmit: any;
//   formValues: any;
//   resetForm: any;
//   setValue: any;
//   onSubmit: (formData: any) => void;
//   handleFormStatus: (isFetching: boolean) => void;
// }

type Props = {
  params: any;
};

const ConnectorConfig = ({ params }: Props) => {
  const { wid = '', type = '' } = params ?? {};

  let initialData = {};

  // const { resetForm, handleFormStatus } = props;

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

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
  const [fetchIntegrationSpec, { data: spec, isFetching, error }] = useLazyFetchIntegrationSpecQuery();

  // Getting keys for the object
  const [fetchConnectorOAuthConfig, { data: keys, isLoading: isKeysLoading, error: keysError }] =
    useLazyGetOAuthApiConfigQuery();

  useEffect(() => {
    // fetch integration spec
    console.log('type:-', type);
    console.log('wid', wid);
    if (type && wid) {
      fetchIntegrationSpec({
        type: type,
        workspaceId: wid
      });
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
    if (spec) {
      console.log('SPec:_', spec);
      if (hasErrorsInData(spec)) {
        const traceError = getErrorsInData(spec);
        console.log('trace error: ', traceError);
        setTraceError(traceError);
      }
    }
  }, [spec]);

  const handleSubmit = () => {
    console.log('handle Submit');
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
    if (error || keysError) {
      return <ErrorComponent error={error || keysError} />;
    }

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
