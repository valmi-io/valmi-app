// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:53 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext, useEffect, useReducer, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import SkeletonLoader from '@components/SkeletonLoader';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import ErrorComponent, { ErrorStatusText } from '@components/Error';

import { AppDispatch } from '@store/store';
import { useLazyDiscoverConnectorQuery, useLazyFetchIntegrationSpecQuery } from '@store/api/apiSlice';
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
import { OAuthContext } from '@/contexts/OAuthContext';
import {
  getCredentialObjKey,
  getSelectedConnectorKey,
  getFreePackageId,
  getCatalogObjKey,
  generateConnectionPayload,
  getExtrasObjKey,
  generateCredentialPayload
} from '@/utils/connectionFlowUtils';
import { isObjectEmpty } from '@/utils/lib';
import { getOAuthParams } from '@/pagesauth/callback';
import { useGetPackageByIdQuery } from '@/store/api/etlApiSlice';
import { useFetch } from '@/hooks/useFetch';
import streamsReducer from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
import { useRouter } from 'next/router';
import {
  useLazyCreateConnectionQuery,
  useLazyCreateDefaultWarehouseConnectionQuery,
  useLazyUpdateConnectionQuery
} from '@/store/api/connectionApiSlice';
import { getShopifyIntegrationType } from '@/content/ConnectionFlow/ConnectionFlowUtils';

type TState = {
  error: string;
  status: FormStatus;
};

const initialObjs: TData = {
  ids: [],
  entities: {}
};

const Item = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectorConfig = ({ params }: TConnectionUpsertProps) => {
  const { wid = '', connectionId = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { nextStep } = useWizard();

  let { oAuthConfigData, setOAuthConfigData, setIsOAuthStepDone } = useContext(OAuthContext);

  let initialData = {};

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { user } = appState ?? {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const isEditableFlow = !!connectionId;
  const entitiesInStore = connectionDataFlow?.entities ?? {};

  const { type = '', display_name: displayName = '', oauth_keys: oauthKeys = '' } = selectedConnector;

  if (type === 'SRC_SHOPIFY') {
    initialData = {
      credentials: {
        auth_method: 'api_password'
      }
    };
  }

  if (connectionDataFlow.entities[getCredentialObjKey(type)]?.config) {
    initialData = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config;
  }

  const [traceError, setTraceError] = useState<any>(null);

  const [data, setData] = useState<any>(initialData);

  const [enableCreate, setEnableCreate] = useState<boolean>(false);
  const [reducerState, dispatchToStore] = useReducer(streamsReducer, initialObjs);

  {
    /* query for connector configuration */
  }
  const [fetchIntegrationSpec, { data: spec, isFetching, error }] = useLazyFetchIntegrationSpecQuery();

  // discover call query
  const [fetchQuery, { data: discoverData, isFetching: isDiscovering, error: discoverError }] =
    useLazyDiscoverConnectorQuery();

  //creating connection query
  const [createConnection] = useLazyCreateConnectionQuery();

  //creating connection query
  const [createDefaultWarehouseConnection] = useLazyCreateDefaultWarehouseConnectionQuery();

  // update connection query
  const [updateConnection] = useLazyUpdateConnectionQuery();

  const {
    data: packageData,
    error: packageError,
    isLoading: isPackageLoading
  } = useFetch({
    query: useGetPackageByIdQuery({ packageId: getFreePackageId() })
  });

  // Getting keys for the object
  const [fetchIntegrationOauthCredentials, { data: keys, isLoading: isKeysLoading, error: keysError }] =
    useLazyGetOAuthApiConfigQuery();

  const [state, setState] = useState<TState>({
    error: '',
    status: 'empty'
  });

  const [results, setResults] = useState(null);

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days', 'auth_method'] });

  const handleSaveObj = (objs: any[]) => {
    dispatchToStore({
      type: 'SAVE',
      payload: {
        objs: objs
      }
    });
  };
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

  useEffect(() => {
    if (keys) {
      if (hasErrorsInData(keys)) {
        const traceError = getErrorsInData(keys);
        setTraceError(traceError);
      } else {
        const setOAuthData = () => {
          //checking if connector configured for oAuth
          const { entities = {} } = keys;
          const { type = '', oauth_keys = 'private' } = selectedConnector;
          if (entities[`${type}`]) {
            oAuthConfigData = { ...oAuthConfigData, isconfigured: true };
            setOAuthConfigData(oAuthConfigData);
          }

          //check if configuration required
          if (oauth_keys === 'private') {
            oAuthConfigData = { ...oAuthConfigData, requireConfiguration: true };
            setOAuthConfigData(oAuthConfigData);
          }

          //check if hasAuthorizedOAuth
          const hasAuthorizedOAuth = (oAuthParams: any, isEditableFlow: boolean) => {
            let authorizedStatus = !isObjectEmpty(oAuthParams) || isEditableFlow ? true : false;
            let authData = { ...oAuthConfigData, isAuthorized: authorizedStatus };
            setOAuthConfigData(authData);
          };
          hasAuthorizedOAuth(selectedConnector?.oauth_params, isEditableFlow);
        };
        setOAuthData();
      }
    }
  }, [spec]);

  useEffect(() => {
    if (spec && !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)) {
      const { oauth_params = {} } = connectionDataFlow.entities[getSelectedConnectorKey()];
      const { isconfigured, isAuthorized } = oAuthConfigData;
      const { client_id, client_secret } = getOAuthParams(oauth_params) || {};
      const obj = {
        ...entitiesInStore,
        [getSelectedConnectorKey()]: {
          ...connectionDataFlow.entities[getSelectedConnectorKey()],
          formValues: {
            ...connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues,
            credentials: {
              client_id,
              client_secret,
              auth_method: 'oauth2.0',
              access_token: connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params?.access_token
            }
          }
        },
        [getCredentialObjKey(type)]: {
          ...connectionDataFlow.entities[getCredentialObjKey(type)],
          spec: spec,
          config: {
            ...connectionDataFlow.entities[getCredentialObjKey(type)]?.config,
            ...connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues,
            credentials: {
              ...getOAuthParams(oauth_params),
              auth_method: 'oauth2.0',
              access_token: connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params?.access_token
            },
            name: displayName
          }
        }
      };
      dispatch(setEntities(obj));
      !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params) && setIsOAuthStepDone(true);
    }
  }, [spec]);

  // run this effect as initially the credentials will be empty, upon redirecting after oAuth, credentials other and form fields are filled and will be available in formValues
  useEffect(() => {
    if (spec && !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)) {
      const formDataFromStore = connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues || {};
      setData(formDataFromStore);
    }
  }, [connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues]);

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
              spec: spec,
              // set the package data in store
              package: packageData?.entities[getFreePackageId().toLocaleUpperCase()]
            }
          };

          dispatch(setEntities(entities));
          if (type !== 'SRC_SHOPIFY') {
            nextStep();
          }
        }
      }
    });
  };
  // Automating discovery flow for shopify
  useEffect(() => {
    if (type === 'SRC_SHOPIFY') {
      //is check done and packages fetched? Then call automateDiscovery
      if (state.status === 'success' && !isPackageLoading) {
        automateDiscovery();
        if (!isDiscovering && discoverError === undefined) {
          getSelectedStreams(discoverData?.resultData);
        }
      }
    }
  }, [state, discoverData]);

  useEffect(() => {
    const entitiesInStore = connectionDataFlow?.entities ?? {};

    let resultsFromStore = null;
    const { ids = [], entities = {} } = reducerState;

    const streamsArr: any[] = [];

    if (ids.length > 0) {
      ids.forEach((id: any) => {
        streamsArr.push(entities[id]);
      });
    }

    if (
      !!connectionDataFlow?.entities[getCatalogObjKey(type)] &&
      !!connectionDataFlow?.entities[getCatalogObjKey(type)]?.catalog
    ) {
      resultsFromStore = connectionDataFlow?.entities[getCatalogObjKey(type)]?.catalog;
    } else {
      resultsFromStore = results;
    }

    const obj = {
      ...entitiesInStore,
      [getCatalogObjKey(type)]: {
        streams: streamsArr,
        catalog: resultsFromStore
      }
    };

    dispatch(setEntities(obj));
  }, [isDiscovering]);

  // prepare payload for discover and make discover call
  const automateDiscovery = () => {
    const payload = {
      config: initialData,
      workspaceId: wid,
      connectorType: type,
      queryId: 1
    };

    if (!isEditableFlow) {
      handleSaveObj([]);
    } else {
      const streams: any[] = connectionDataFlow?.entities[getCatalogObjKey(type)]('streams');
      handleSaveObj(streams);
    }

    fetchQuery(payload);
  };

  // filtering streams based on scopes from package and setting filtered streams and dispatching to reducer state
  const getSelectedStreams = (results: any) => {
    const scopes = connectionDataFlow.entities[getCredentialObjKey(type)]?.package?.scopes;

    const rows = results?.catalog?.streams ?? [];

    const namesInScopes = scopes.map((item: string) => item.split('read_')[1]);

    const authorizedScopesRows = rows.filter(({ name }: { name: string }) => {
      if (namesInScopes.includes(name)) return true;
    });

    dispatchToStore({
      type: 'TOGGLE_SELECT_ALL',
      payload: {
        checked: true,
        objs: authorizedScopesRows
      }
    });

    !isDiscovering && !!discoverData && setEnableCreate(true);
  };

  const onCreateAutomation = async () => {
    const schedulePayload = {
      name: type?.toLocaleLowerCase(),
      run_interval: 'Every 1 hour'
    };

    let credentialObj = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config ?? {};
    const streams = connectionDataFlow?.entities[getCatalogObjKey(type)]?.streams ?? {};

    const extras = connectionDataFlow?.entities[getExtrasObjKey()] ?? {};

    let credentialPayload = null;
    let destCredentialPayload = null;

    const connectionPayload = generateConnectionPayload(streams, schedulePayload, wid, isEditableFlow, extras);

    const payload: any = {
      workspaceId: wid,
      connectionPayload
    };

    if (!isEditableFlow) {
      credentialPayload = generateCredentialPayload(credentialObj, type, user);
      destCredentialPayload = generateCredentialPayload(credentialObj, 'DEST_POSTGRES-DEST', user);
      payload['credentialPayload'] = credentialPayload;
      payload['destCredentialPayload'] = destCredentialPayload;
    }

    const query = getConnectionQuery({ integrationType: type, isEditable: isEditableFlow });

    console.log('create connection payload', {
      payload,
      type,
      query
    });
    // const data = await query(payload).unwrap();
    // router.push(`/spaces/${wid}/connections`);
  };

  const getConnectionQuery = ({ isEditable, integrationType }: { isEditable: boolean; integrationType: string }) => {
    if (type === getShopifyIntegrationType()) {
      // TODO: handle update default warehouse connection
      return !isEditableFlow ? createDefaultWarehouseConnection : updateConnection;
    } else {
      return !isEditableFlow ? createConnection : updateConnection;
    }
  };

  const handleFormChange = async ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);

    let formData = { ...oAuthConfigData, formValues: data };
    await setOAuthConfigData(formData);
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
            enableCreate={enableCreate}
            onCreateAutomation={onCreateAutomation}
          />
          <CheckConnectionPageContent state={state} isDiscovering={isDiscovering} />
        </>
      );
    }
  };

  return <ConnectorLayout title={`Connect to ${displayName}`}>{getDisplayComponent()}</ConnectorLayout>;
};

export default ConnectorConfig;

const CheckConnectionPageContent = ({
  state: { error = '', status = '' },
  isDiscovering
}: {
  state: TState;
  isDiscovering: any;
}) => {
  if (status === 'empty' || !status) return null;
  const isFetching = !!(status === 'submitting');

  return (
    <Item>
      {isFetching ? (
        <Item>
          <CircularProgress size={20} sx={{ mx: 1 }} />
          <p>Testing connection...</p>
        </Item>
      ) : isDiscovering ? (
        <Item>
          <CircularProgress size={20} sx={{ mx: 1 }} />
          <p>Discovering objects from connection...</p>
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
