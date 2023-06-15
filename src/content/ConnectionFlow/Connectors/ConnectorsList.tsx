/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:32 pm
 * Author: Nagendra S @ valmi.io
 */

import { Grid } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { ConnectorModel } from '@/content/Connections/ConnectionModel';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store/store';
import ConnectorCard from './ConnectorCard';
import { setConnectionFlow } from '../../../store/reducers/connectionFlow';
import { useEffect } from 'react';
import { initialiseConnectorSelectionState } from '../../../utils/connection-utils';
interface ConnectorListProps {
  data: ConnectorModel[];
}

const ConnectorsList = ({ data }: ConnectorListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const connection_flow = useSelector(
    (state: RootState) => state.connectionFlow
  );

  const {
    selected_connector = null,
    steps = 0,
    currentStep = 0
  } = connection_flow.flowState;

  useEffect(() => {
    // initialize connector selection state
    initialiseConnectorSelectionState(dispatch, connection_flow);
  }, []);

  const handleConnectorOnClick = (connector: ConnectorModel) => {
    // increase remaining steps count.
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,
        //oauth_params: {},
        steps: currentStep + 1,
        selected_connector: {
          type: connector.type,
          display_name: connector.display_name
        }
      })
    );
  };

  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {/* connectors */}
        {data.map((item) => {
          return (
            <ConnectorCard
              key={item.type}
              item={item}
              handleConnectorOnClick={handleConnectorOnClick}
              selectedConnectorType={
                selected_connector ? selected_connector.type : ''
              }
            />
          );
        })}
      </Grid>
    </>
  );
};

export default ConnectorsList;
