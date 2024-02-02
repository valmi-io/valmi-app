/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 30th 2023, 5:52:08 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import ConnectorsPageContent from '@/content/ConnectionFlow/Connectors/ConnectorsPageContent';

import SkeletonLoader from '@components/SkeletonLoader';
import ErrorComponent, { ErrorStatusText } from '@components/Error';

import { RootState } from '@store/reducers';
import { useFetchConnectorsQuery } from '@store/api/apiSlice';

import constants from '@constants/index';
import { useFetch } from '@/hooks/useFetch';

const Connectors = () => {
  const flowState = useSelector((state: RootState) => state.connectionFlow.flowState);
  const { connection_type = '' } = flowState;
  // connectors query

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({}, { refetchOnMountOrArgChange: true })
  });

  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      if (data[connection_type]) {
        setFilteredData(data[connection_type]);
      }
    }
  }, [data]);

  return (
    <ConnectorLayout title={constants.connections.SELECT_CONNECTOR_LAYOUT_TITLE}>
      {/** Display error */}
      {error && <ErrorComponent error={error} />}

      {/* Display trace error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display skeleton */}
      <SkeletonLoader loading={isLoading} />

      {/** Display page content */}
      {!error && !isLoading && data && <ConnectorsPageContent data={filteredData} />}
    </ConnectorLayout>
  );
};

export default Connectors;
