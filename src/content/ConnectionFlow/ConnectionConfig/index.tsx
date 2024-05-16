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
  isConnectionAutomationFlow,
  getExtrasObjKey,
  generateSourcePayload,
  generateDestinationPayload,
  filterStreamsBasedOnScope
} from '@/utils/connectionFlowUtils';
import { isObjectEmpty } from '@/utils/lib';
import streamsReducer, { generateStreamObj } from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
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

  const entitiesInStore = connectionDataFlow?.entities ?? {};

  const isEditableFlow = !!connectionId;

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

  // discover call query
  const [fetchObjects] = useLazyDiscoverConnectorQuery();

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

  useEffect(() => {
    if (combinedConfigData) {
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

  useEffect(() => {
    if (
      combinedConfigData?.spec &&
      !isObjectEmpty(connectionDataFlow.entities[getSelectedConnectorKey()]?.oauth_params)
    ) {
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
          spec: combinedConfigData?.spec,
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
  }, [combinedConfigData?.spec]);

  const handleSubmit = (data: any) => {
    console.log('handle submit:_', data);
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

  // discovering integration objects
  const discoverObjects = async () => {
    const { formValues = {} } = oAuthConfigData ?? {};
    const payload = {
      config: formValues,
      workspaceId: wid,
      connectorType: type,
      queryId: 1
    };

    await queryHandler({
      query: fetchObjects,
      payload: payload,
      successCb: (data) => {
        const results = data?.resultData ?? {};
        const filteredStreams = filterStreamsBasedOnScope(results, connectionDataFlow, type);

        let streams = [];

        for (let i = 0; i < filteredStreams.length; i++) {
          streams.push(generateStreamObj(filteredStreams[i], 'stream'));
        }

        onCreateAutomation(streams);
      },
      errorCb: (err) => {
        setState((state) => ({
          ...state,
          status: 'error',
          error: err
        }));
      }
    });
  };

  const onCreateAutomation = async (streams: any) => {
    const schedulePayload = {
      name: type?.toLocaleLowerCase(),
      run_interval: 'Every 1 hour'
    };

    const payload = generateConnectionPayload({
      connectionDataFlow: connectionDataFlow,
      streams: streams,
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
    setState((state) => ({
      ...state,
      status: 'success'
    }));
    router.push(`/spaces/${wid}/connections`);
  };

  const errorCb = (error: any) => {
    setState((state) => ({
      ...state,
      status: 'error',
      error: error
    }));
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
        handleSubmit={handleSubmit}
        status={state.status}
        key={'IntegrationSpec'}
      />
    </ConnectorLayout>
  );
};

export default ConnectionConfig;
