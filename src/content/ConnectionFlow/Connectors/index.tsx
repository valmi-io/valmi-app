/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 30th 2023, 5:52:08 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import ConnectorsList from '@content/ConnectionFlow/Connectors/ConnectorsList';

import SkeletonLoader from '@components/SkeletonLoader';
import ErrorComponent from '@components/Error';

import { RootState } from '@store/reducers';
import { useFetchConnectorsQuery } from '@store/api/apiSlice';

import constants from '@constants/index';

const Connectors = () => {
  const flowState = useSelector(
    (state: RootState) => state.connectionFlow.flowState
  );
  const { connection_type = '' } = flowState;
  // connectors query
  const { data, isLoading, isError, error } = useFetchConnectorsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      if (data[connection_type]) {
        setFilteredData(data[connection_type]);
      }
    }
  }, [data]);

  return (
    <ConnectorLayout
      title={constants.connections.SELECT_CONNECTOR_LAYOUT_TITLE}
    >
      {isError && <ErrorComponent error={error} />}
      <SkeletonLoader loading={isLoading} />
      {!isLoading && data && <ConnectorsList data={filteredData} />}
    </ConnectorLayout>
  );
};

export default Connectors;
