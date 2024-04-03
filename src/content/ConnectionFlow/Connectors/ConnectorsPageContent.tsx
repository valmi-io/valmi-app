/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:32 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

import { initialiseConnectorSelectionState } from '@utils/connection-utils';
import ConnectorsList, { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { useRouter } from 'next/router';

interface ConnectorListProps {
  data: any;
}

const ConnectorsPageContent = ({ data }: ConnectorListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId } = appState;

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { selected_connector = null, steps = 0, currentStep = 0 } = connection_flow.flowState;

  useEffect(() => {
    // initialize connector selection state
    initialiseConnectorSelectionState(dispatch, connection_flow);
  }, []);

  const handleItemOnClick = () => {
    router.push(`/spaces/${workspaceId}/connections/create`);
  };

  return (
    <ConnectorsList
      key={`connectorsList`}
      data={data}
      handleItemOnClick={handleItemOnClick}
      selectedType={selected_connector?.type ?? ''}
    />
  );
};

export default ConnectorsPageContent;
