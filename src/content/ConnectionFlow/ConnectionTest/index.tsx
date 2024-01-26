/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { Box, CircularProgress, styled } from '@mui/material';
import { CheckOutlined, ErrorOutline } from '@mui/icons-material';

import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '@components/Error/ErrorUtils';

import { RootState } from '@store/reducers';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

const Item = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectionTest = () => {
  const connection_flow = useSelector(
    (state: RootState) => state.connectionFlow
  );

  const { connector_config = {}, selected_connector = null } =
    connection_flow.flowState;

  const dispatch = useDispatch();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const [connectionErrorMsg, setConnectionErrorMsg] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [checkingConnection, setCheckingConnection] = useState<boolean>(true);

  useEffect(() => {
    if (connector_config) {
      const config = {
        config: connector_config
      };
      const type = selected_connector ? selected_connector.type : '';
      checkConnectionConfig(
        `/workspaces/${workspaceId}/connectors/${type}/check`,
        'POST',
        config
      );
    }
  }, []);

  const checkConnectionConfig = async (
    url: string,
    method: string,
    data: any
  ) => {
    try {
      const response = await axios.post('/api/checkConnection', {
        url,
        method,
        data
      });
      const result = response.data;
      if (hasErrorsInData(result)) {
        const error = getErrorsInData(result);
        setConnectionStatus('FAILED');
        setConnectionErrorMsg(error);
      } else {
        if (result.connectionStatus.status === 'FAILED') {
          setConnectionStatus(result.connectionStatus.status);
          setConnectionErrorMsg(result.connectionStatus.message);
        } else {
          setConnectionStatus(result.connectionStatus.status);
          dispatch(
            setConnectionFlow({
              ...connection_flow.flowState,
              lastStep: true
            })
          );
        }
      }
      setCheckingConnection(false);
    } catch (error: any) {
      // Handle any errors that occur during the API request
      const errors = getErrorsInErrorObject(error.response);

      const { message = '' } = errors || {};
      setCheckingConnection(false);
      setConnectionStatus('FAILED');
      setConnectionErrorMsg(message);
    }
  };

  const checkConnectionStatus = (
    connectionStatus: any,
    connectionErrorMsg: string
  ) => {
    let connectionMessage;
    let success;
    if (connectionStatus === 'FAILED') {
      connectionMessage = connectionErrorMsg;
      success = false;
    } else {
      connectionMessage = 'Test success';
      success = true;
    }

    return (
      <Item>
        {success ? (
          <CheckOutlined color="primary" sx={{ mx: 1 }} />
        ) : (
          <ErrorOutline color="error" sx={{ mx: 1 }} />
        )}
        <p>{connectionMessage}</p>
      </Item>
    );
  };

  const diplayConnectionLoading = () => {
    return (
      <Item>
        <CircularProgress size={20} sx={{ mx: 1 }} />
        <p>Testing connection...</p>
      </Item>
    );
  };

  return (
    <>
      {checkingConnection && diplayConnectionLoading()}
      {!checkingConnection &&
        checkConnectionStatus(connectionStatus, connectionErrorMsg)}
    </>
  );
};

export default ConnectionTest;
