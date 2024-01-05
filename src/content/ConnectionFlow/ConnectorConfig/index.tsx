// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
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
import { useLazyFetchConnectorSpecQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import FormLayout from '@/layouts/FormLayout';
import ConnectorInstructions from '@/content/ConnectionFlow/ConnectorConfig/ConnectorInstructions';
import ConnectorFormFieldsControl from '@/content/ConnectionFlow/ConnectorConfig/ConnectorFormFieldsControl';

interface ConnectorConfigProps {
  control: any;
  handleSubmit: any;
  formValues: any;
  resetForm: any;
  setValue: any;
  onSubmit: (formData: any) => void;
}

const ConnectorConfig = (props: ConnectorConfigProps) => {
  const { resetForm } = props;

  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { flowState: { selected_connector = null, connector_config = null, connection_title = '' } = {} } =
    connection_flow;

  const [traceError, setTraceError] = useState<any>(null);

  {
    /* query for connector configuration */
  }
  const [fetchConnectorConfig, { data, isFetching, isError, error }] = useLazyFetchConnectorSpecQuery();

  useEffect(() => {
    if (selected_connector) {
      // reset form if no connector_config in connection_flow
      if (!connector_config) {
        resetForm({});
      } else {
        resetForm((formValues) => ({
          ...formValues,
          ...connector_config,
          title: connection_title
        }));
      }
      fetchConnectorConfig({
        type: selected_connector.type,
        workspaceId: workspaceId
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setTraceError(traceError);
      } else {
        // saving connector spec in store
        dispatch(
          setConnectionFlow({
            ...connection_flow.flowState,
            connector_spec: data
          })
        );
      }
    }
  }, [data]);

  return (
    <ConnectorLayout title={`Connect to ${selected_connector ? selected_connector.display_name : 'connector'}`}>
      {/** Display Errors */}
      {isError && <ErrorComponent error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      <SkeletonLoader loading={isFetching} />

      {/** Display Content */}
      {!isFetching && data && (
        <FormLayout
          formComp={<ConnectorFormFieldsControl {...props} data={data} />}
          instructionsComp={<ConnectorInstructions data={data} selected_connector={selected_connector} />}
        />
      )}
    </ConnectorLayout>
  );
};

export default ConnectorConfig;
