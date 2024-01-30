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

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@components/Error/ErrorUtils';

import { RootState } from '@store/reducers';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

const Item = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

type ConnectionTestProps = {
  handleFormStatus: (isFetching: boolean) => void;
};

type ConnectionTestState = {
  error: string;
  status: string;
  isFetching: boolean;
};

const ConnectionTest = ({ handleFormStatus }: ConnectionTestProps) => {
  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { connector_config = {}, selected_connector = null } = connection_flow.flowState;

  const dispatch = useDispatch();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const [connectionTestState, setConnectionTestState] = useState<ConnectionTestState>({
    error: '',
    status: '',
    isFetching: true
  });

  useEffect(() => {
    if (connector_config) {
      const config = {
        config: connector_config
      };
      const type = selected_connector ? selected_connector.type : '';
      checkConnectionConfig(`/workspaces/${workspaceId}/connectors/${type}/check`, 'POST', config);
    }
  }, []);

  const checkConnectionConfig = async (url: string, method: string, data: any) => {
    try {
      handleFormStatus(true);
      const response = await axios.post('/api/checkConnection', {
        url,
        method,
        data
      });
      const result = response.data;
      if (hasErrorsInData(result)) {
        const error = getErrorsInData(result);

        setConnectionTestState((state) => ({
          ...state,
          status: 'FAILED',
          error: error
        }));
      } else {
        const { connectionStatus: { status = '', message = '' } = {} } = result ?? {};
        if (status === 'FAILED') {
          setConnectionTestState((state) => ({
            ...state,
            status: status,
            error: message
          }));
        } else {
          setConnectionTestState((state) => ({
            ...state,
            status: status
          }));

          dispatch(
            setConnectionFlow({
              ...connection_flow.flowState,
              lastStep: true
            })
          );
        }
      }
    } catch (error: any) {
      // Handle any errors that occur during the API request
      const errors = getErrorsInErrorObject(error.response);

      const { message = '' } = errors || {};

      setConnectionTestState((state) => ({
        ...state,
        status: 'FAILED',
        error: message
      }));
    } finally {
      handleFormStatus(false);
      setConnectionTestState((state) => ({
        ...state,
        isFetching: false
      }));
    }
  };

  const PageContent = () => {
    const { isFetching } = connectionTestState;

    if (isFetching) {
      return <Loader />;
    }
    return <ConnectionTestResult data={connectionTestState} />;
  };

  return (
    <>
      <PageContent />
    </>
  );
};

export default ConnectionTest;

const Loader = () => {
  return (
    <Item>
      <CircularProgress size={20} sx={{ mx: 1 }} />
      <p>Testing connection...</p>
    </Item>
  );
};

const ConnectionTestResult = ({ data: { error, status } }: { data: ConnectionTestState }) => {
  return (
    <Item>
      {status === 'FAILED' ? (
        <ErrorOutline color="error" sx={{ mx: 1 }} />
      ) : (
        <CheckOutlined color="primary" sx={{ mx: 1 }} />
      )}
      <p>{status === 'FAILED' ? error : 'Test success'}</p>
    </Item>
  );
};
