import { useContext, useEffect, useReducer, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import { AppDispatch } from '@store/store';
import { useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import { useWizard } from 'react-use-wizard';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import { httpPostRequestHandler, queryHandler } from '@/services';
import { apiRoutes } from '@/utils/router-utils';
import { OAuthContext } from '@/contexts/OAuthContext';
import {
  getCredentialObjKey,
  getSelectedConnectorKey,
  getFreePackageId,
  getCatalogObjKey,
  generateConnectionPayload,
  getShopifyIntegrationType,
  isConnectionAutomationFlow
} from '@/utils/connectionFlowUtils';
import { isObjectEmpty } from '@/utils/lib';
import streamsReducer from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
import { useRouter } from 'next/router';
import {
  useLazyCreateConnectionQuery,
  useLazyCreateDefaultWarehouseConnectionQuery,
  useLazyUpdateConnectionQuery
} from '@/store/api/connectionApiSlice';
import { useSession } from 'next-auth/react';
import { TConnectionCheckState } from '@/content/ConnectionFlow/ConnectionFlowComponent/ConnectionCheck';
import { useCombinedIntegrationConfigQuery } from '@/content/ConnectionFlow/useCombinedQuery';
import IntegrationSpec from '@/content/ConnectionFlow/IntegrationSpec';
import { getOAuthParams } from '@/pagesauth/callback';
import { TData } from '@/utils/typings.d';

const initialObjs: TData = {
  ids: [],
  entities: {}
};

const ConnectionConfig = ({ params }: TConnectionUpsertProps) => {
  const { wid = '', connectionId = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { data: session } = useSession();

  const { nextStep } = useWizard();

  let { oAuthConfigData, setOAuthConfigData, setIsOAuthStepDone } = useContext(OAuthContext);

  let initialData = {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const isEditableFlow = !!connectionId;
  const entitiesInStore = connectionDataFlow?.entities ?? {};

  const { type = '', display_name: displayName = '', oauth_keys: oauthKeys = '', mode = '' } = selectedConnector;

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

  const [data, setData] = useState<any>(initialData);

  const [enableCreate, setEnableCreate] = useState<boolean>(false);
  const [reducerState, dispatchToStore] = useReducer(streamsReducer, initialObjs);

  // discover call query
  const [fetchObjects, { data: discoverData, isFetching: isDiscovering, error: discoverError }] =
    useLazyDiscoverConnectorQuery();

  //create connection query
  const [createConnection] = useLazyCreateConnectionQuery();

  //create default warehouse connection query
  const [createDefaultWarehouseConnection] = useLazyCreateDefaultWarehouseConnectionQuery();

  // update connection query
  const [updateConnection] = useLazyUpdateConnectionQuery();

  const {
    data: combinedConfigData,
    error: combinedConfigError,
    isLoading: combinedConfigIsLoading,
    traceError: combinedConfigTraceError
  } = useCombinedIntegrationConfigQuery({ oauthKeys: oauthKeys, type: type, workspaceId: wid });

  const [state, setState] = useState<TConnectionCheckState>({
    error: '',
    status: 'empty'
  });

  const [results, setResults] = useState(null);

  const handleSaveObj = (objs: any[]) => {
    dispatchToStore({
      type: 'SAVE',
      payload: {
        objs: objs
      }
    });
  };

  useEffect(() => {
    if (combinedConfigData) {
      console.log('combinedConfigData', combinedConfigData);
      const { spec } = combinedConfigData ?? {};
      setResults(spec);

      if (combinedConfigData.oauthKeysData) {
        const setOAuthData = () => {
          //checking if connector configured for oAuth
          const { entities = {} } = combinedConfigData?.oauthKeysData ?? {};

          if (entities[`${type}`]) {
            oAuthConfigData = { ...oAuthConfigData, isconfigured: true };
            setOAuthConfigData(oAuthConfigData);
          }

          //check if configuration required
          if (oauthKeys === 'private') {
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
  }, [combinedConfigData]);

  // useEffect(() => {
  //   if (
  //     combinedConfigData?.spec &&
  //     !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)
  //   ) {
  //     const { oauth_params = {} } = connectionDataFlow.entities[getSelectedConnectorKey()];
  //     const { isconfigured, isAuthorized } = oAuthConfigData;
  //     const { client_id, client_secret } = getOAuthParams(oauth_params) || {};
  //     const obj = {
  //       ...entitiesInStore,
  //       [getSelectedConnectorKey()]: {
  //         ...connectionDataFlow.entities[getSelectedConnectorKey()],
  //         formValues: {
  //           ...connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues,
  //           credentials: {
  //             client_id,
  //             client_secret,
  //             auth_method: 'oauth2.0',
  //             access_token: connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params?.access_token
  //           }
  //         }
  //       },
  //       [getCredentialObjKey(type)]: {
  //         ...connectionDataFlow.entities[getCredentialObjKey(type)],
  //         spec: combinedConfigData?.spec,
  //         config: {
  //           ...connectionDataFlow.entities[getCredentialObjKey(type)]?.config,
  //           ...connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues,
  //           credentials: {
  //             ...getOAuthParams(oauth_params),
  //             auth_method: 'oauth2.0',
  //             access_token: connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params?.access_token
  //           },
  //           name: displayName
  //         }
  //       }
  //     };
  //     dispatch(setEntities(obj));
  //     !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params) && setIsOAuthStepDone(true);
  //   }
  // }, [combinedConfigData?.spec]);

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
          error: err
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
          const entities = {
            ...connectionDataFlow.entities,
            [getCredentialObjKey(type)]: {
              ...connectionDataFlow.entities[getCredentialObjKey(type)],
              //TODO : after check, get the name from the response and send it here instead displayName
              config: {
                ...payload.config,
                name: displayName
              },
              spec: combinedConfigData?.spec ?? {},
              // set the package data in store
              package: combinedConfigData?.packages?.entities[getFreePackageId().toLocaleUpperCase()]
            }
          };

          dispatch(setEntities(entities));
          if (isConnectionAutomationFlow({ mode, type })) {
            // discover objects
            discoverObjects();
          } else {
            setState((state) => ({
              ...state,
              status: 'success'
            }));
            nextStep();
          }
        }
      }
    });
  };

  const discoverObjects = () => {
    const payload = {
      config: initialData,
      workspaceId: wid,
      connectorType: type,
      queryId: 1
    };

    console.log('discovering objects...');

    if (!isEditableFlow) {
      handleSaveObj([]);
    } else {
      const streams: any[] = connectionDataFlow?.entities[getCatalogObjKey(type)]('streams');
      handleSaveObj(streams);
    }

    fetchObjects(payload);
  };

  // Automating discovery flow for shopify
  // useEffect(() => {
  //   if (type === 'SRC_SHOPIFY') {
  //     //is check done and packages fetched? Then call automateDiscovery
  //     if (state.status === 'success' && !isPackageLoading) {
  //       automateDiscovery();
  //       if (!isDiscovering && discoverError === undefined) {
  //         getSelectedStreams(discoverData?.resultData);
  //       }
  //     }
  //   }
  // }, [state, discoverData]);

  useEffect(() => {
    if (discoverData) {
      console.log('getting selected streams:-');

      getSelectedStreams(discoverData?.resultData);
    }
  }, [discoverData]);

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

    const payload = generateConnectionPayload({
      connectionDataFlow: connectionDataFlow,
      isEditableFlow: isEditableFlow,
      schedulePayload: schedulePayload,
      type: type,
      user: session?.user ?? {},
      workspaceId: wid
    });

    const query = getConnectionQuery({ type: type, isEditableFlow: isEditableFlow });

    await queryHandler({ query: query, payload: payload, successCb, errorCb });
  };

  const successCb = (data: any) => {
    router.push(`/spaces/${wid}/connections`);
  };

  const errorCb = (error: any) => {
    //TODO: handle error
    console.error('error', error);
  };

  const getConnectionQuery = ({ isEditableFlow, type }: { isEditableFlow: boolean; type: string }) => {
    if (type === getShopifyIntegrationType()) {
      // TODO: handle update default warehouse connection
      return !isEditableFlow ? createDefaultWarehouseConnection : updateConnection;
    } else {
      return !isEditableFlow ? createConnection : updateConnection;
    }
  };

  return (
    <ConnectorLayout title={`Connect to ${displayName}`}>
      <IntegrationSpec
        error={combinedConfigError}
        isLoading={combinedConfigIsLoading}
        traceError={combinedConfigTraceError}
        specData={combinedConfigData?.spec ?? {}}
        key={'IntegrationSpec'}
      />
    </ConnectorLayout>
  );
};

export default ConnectionConfig;
