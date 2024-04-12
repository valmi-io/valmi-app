// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
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
import { useLazyFetchIntegrationSpecQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import { useLazyGetOAuthApiConfigQuery } from '@/store/api/oauthApiSlice';
import FormControlComponent from '@/components/FormControlComponent';
import { FormStatus } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { useWizard } from 'react-use-wizard';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import { Box, CircularProgress, styled } from '@mui/material';
import { CheckOutlined, ErrorOutline } from '@mui/icons-material';
import { httpPostRequestHandler } from '@/services';
import { apiRoutes } from '@/utils/router-utils';
import { getCredentialObjKey, getSelectedConnectorKey } from '@/utils/connectionFlowUtils';

type TState = {
  error: string;
  status: FormStatus;
};

const Item = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectorConfig = ({ params }: TConnectionUpsertProps) => {
  const { wid = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();

  const { nextStep } = useWizard();

  let initialData = {};

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', display_name: displayName = '', oauth_keys: oauthKeys = '' } = selectedConnector;

  if (connectionDataFlow.entities[getCredentialObjKey(type)]?.config) {
    initialData = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config;
  }

  const { flowState: {} = {} } = connection_flow;

  const [traceError, setTraceError] = useState<any>(null);

  const [data, setData] = useState<any>(initialData);

  {
    /* query for connector configuration */
  }
  const [fetchIntegrationSpec, { data: spec, isFetching, error }] = useLazyFetchIntegrationSpecQuery();

  // Getting keys for the object
  const [fetchIntegrationOauthCredentials, { data: keys, isLoading: isKeysLoading, error: keysError }] =
    useLazyGetOAuthApiConfigQuery();

  const [state, setState] = useState<TState>({
    error: '',
    status: 'empty'
  });

  const [results, setResults] = useState(null);

  const handleOAuthButtonClick = () => alert('HELLOO');

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  useEffect(() => {
    // fetch integration spec

    if (type && wid) {
      if (connectionDataFlow?.entities[getCredentialObjKey[type]]?.spec) {
        setResults(connectionDataFlow?.entities[getCredentialObjKey[type]]?.spec);
      } else {
        fetchIntegrationSpec({
          type: type,
          workspaceId: wid
        });
      }
    }
  }, [type, wid]);

  useEffect(() => {
    // fetch connector oauth credentials
    if (oauthKeys === 'private') {
      fetchIntegrationOauthCredentials({
        workspaceId: wid,
        type: type
      });
    }
  }, [oauthKeys]);

  useEffect(() => {
    if (spec) {
      if (hasErrorsInData(spec)) {
        const traceError = getErrorsInData(spec);
        setTraceError(traceError);
      } else {
        setResults(spec);
      }
    }
  }, [spec]);

  const handleSubmit = () => {
    setState((state) => ({
      ...state,
      status: 'submitting'
    }));

    const payload = {
      config: data
    };

    checkConnection(`/workspaces/${wid}/connectors/${type}/check`, 'POST', payload);
  };

  const checkConnection = async (url: string, method: string, payload: any) => {
    await httpPostRequestHandler({
      route: apiRoutes['check'],
      url,
      payload,
      errorCb: (err) => {
        setState((state) => ({
          ...state,
          status: 'error',
          error: error
        }));
      },
      successCb: (res) => {
        const { connectionStatus: { status = '', message = '' } = {} } = res ?? {};
        if (status === 'FAILED') {
          setState((state) => ({
            ...state,
            status: 'error',
            error: message
          }));
        } else {
          setState((state) => ({
            ...state,
            status: 'success'
          }));

          const entities = {
            ...connectionDataFlow.entities,
            [getCredentialObjKey(type)]: {
              ...connectionDataFlow.entities[getCredentialObjKey(type)],
              //TODO : after check, get the name from the response and send it here instead displayName
              config: {
                ...payload.config,
                name: displayName
              },
              spec: spec
            }
          };

          dispatch(setEntities(entities));

          nextStep();
        }
      }
    });
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const getDisplayComponent = () => {
    if (error || keysError) {
      return <ErrorComponent error={error || keysError} />;
    }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isFetching || isKeysLoading) {
      return <SkeletonLoader loading={isFetching || isKeysLoading} />;
    }

    if (results) {
      const schema = results?.spec?.connectionSpecification ?? {};

      return (
        <>
          <FormControlComponent
            key={`SourceConfig`}
            deleteTooltip="Delete source"
            editing={false}
            onDelete={() => {}}
            onFormChange={handleFormChange}
            onSubmitClick={handleSubmit}
            isDeleting={false}
            status={state.status}
            error={!!state.error}
            jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
            removeAdditionalFields={false}
          />
          <CheckConnectionPageContent state={state} />
        </>
      );
    }
  };

  return <ConnectorLayout title={`Connect to ${displayName}`}>{getDisplayComponent()}</ConnectorLayout>;
};

export default ConnectorConfig;

const CheckConnectionPageContent = ({ state: { error = '', status = '' } }: { state: TState }) => {
  if (status === 'empty' || !status) return null;
  const isFetching = !!(status === 'submitting');

  return (
    <Item>
      {isFetching ? (
        <Item>
          <CircularProgress size={20} sx={{ mx: 1 }} />
          <p>Testing connection...</p>
        </Item>
      ) : (
        <>
          {status === 'error' && <ErrorOutline color="error" sx={{ mx: 1 }} />}
          {status === 'success' && <CheckOutlined color="primary" sx={{ mx: 1 }} />}
          <p>{status === 'error' ? error : 'Test success'}</p>
        </>
      )}
    </Item>
  );
};
