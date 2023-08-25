// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Card } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFetchCredentialsQuery } from '../../store/api/apiSlice';
import { useEffect, useState } from 'react';
import { RootState } from '../../store/reducers';
import ConnectionsTable from './ConnectionsTable';
import { ErrorStatusText } from '../../components/Error';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../components/Error/ErrorUtils';
import { SkeletonContainer } from '../../components/Layouts/Layouts';
import SkeletonLoader from '../../components/SkeletonLoader';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ErrorContainer from '../../components/Error/ErrorContainer';

const getConnectorConfig = (connector: any) => {
  const config = {
    id: connector.id,
    name: connector.name,
    display_name: connector.display_name,
    config: connector.connector_config,
    type: connector.connector_type.split('_')[1],
    account: connector.account
  };
  return config;
};

const Connections = ({ connection_type }: any) => {
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const { data, isFetching, isError, error } = useFetchCredentialsQuery(
    {
      workspaceId,
      queryId: 0
    },
    { refetchOnMountOrArgChange: true }
  );

  const [connectionsLoading, setConnectionsLoading] = useState<boolean>(true);
  const [connections, setConnections] = useState<any>([]);

  const [traceError, setTraceError] = useState<any>(null);

  useEffect(() => {
    if (data && data.resultData) {
      // checking if data has any trace errors.
      if (hasErrorsInData(data.resultData)) {
        const traceError = getErrorsInData(data.resultData);
        setTraceError(traceError);
      } else {
        filterConnections(data.resultData, connection_type);
      }
    }
  }, [data]);

  const filterConnections = (data, connection_type) => {
    let connections = [];
    data.forEach((connector) => {
      const connectorType = connector.connector_type.split('_')[0];
      if (connection_type === connectorType) {
        connections.push(getConnectorConfig(connector));
      }
    });
    setConnections(connections);
    setConnectionsLoading(false);
  };

  const displayContent = () => {
    if (connections.length > 0) {
      return (
        <ConnectionsTable
          connections={connections}
          connector_type={connection_type}
        />
      );
    }

    {
      /** Display empty component */
    }
    return (
      <ListEmptyComponent
        description={'No connections found in this workspace'}
      />
    );
  };

  return (
    <Card>
      {/** Display Errors */}
      {isError && <ErrorContainer error={error?.errorData} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      {isFetching && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}

      {/** Display Content */}
      {!isError && !isFetching && connections && displayContent()}
    </Card>
  );
};

export default Connections;
