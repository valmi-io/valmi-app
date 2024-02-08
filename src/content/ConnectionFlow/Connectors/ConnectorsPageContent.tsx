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

interface ConnectorListProps {
  data: any;
}

const ConnectorsPageContent = ({ data }: ConnectorListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { selected_connector = null, steps = 0, currentStep = 0 } = connection_flow.flowState;

  useEffect(() => {
    // initialize connector selection state
    initialiseConnectorSelectionState(dispatch, connection_flow);
  }, []);

  const handleItemOnClick = (connector: ConnectorType) => {
    const { type, display_name, oauth_keys = 'private' } = connector;

    // increase remaining steps count.
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,

        steps: currentStep + 1,
        selected_connector: {
          type: type,
          display_name: display_name,
          oauth_keys: oauth_keys
        }
      })
    );
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
