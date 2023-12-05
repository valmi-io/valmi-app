// @ts-nocheck

/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, October 17th 2023, 3:34:09 pm
 * Author: Nagendra S @ valmi.io
 */

import { useConnectionsData } from '@content/Connections/useConnectionsData';
import { useMemo } from 'react';

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

export const useFilteredConnectionsData = (
  workspaceId: string,
  connectionType: string
) => {
  const {
    data: connectionsData,
    connectionsError,
    isFetching,
    traceError
  } = useConnectionsData(workspaceId);

  // Filter connections data based on the connection type

  const filteredConnectionsData = useMemo(() => {
    const filteredConnections = connectionsData
      .filter((connector: any) => {
        const connectorType = connector.connector_type.split('_')[0];
        return connectionType === connectorType;
      })
      .map(getConnectorConfig);
    return filteredConnections;
  }, [connectionsData]);

  return { filteredConnectionsData, connectionsError, isFetching, traceError };
};
