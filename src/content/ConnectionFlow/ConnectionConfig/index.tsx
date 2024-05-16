import { useContext, useEffect, useReducer, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import { AppDispatch } from '@store/store';
import { useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import { useWizard } from 'react-use-wizard';
import { clearConnectionFlowState, setEntities } from '@/store/reducers/connectionDataFlow';
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
  filterStreamsBasedOnScope,
  initializeConnectionConfigDataFlow
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
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { FormStatus } from '@/utils/form-utils';

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

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  useEffect(() => {
    if (connectionDataFlow) {
      console.log('connectionDataFlow is updated', connectionDataFlow);
    }
  }, [connectionDataFlow]);
  useEffect(() => {
    console.log('inside useeffect');
    if (combinedConfigData) {
      console.log('inside combine');
      const { spec, packages, oauthKeysData } = combinedConfigData ?? {};

      // initializing connection config data flow
      initializeConnectionConfigDataFlow({
        connectionDataFlow: connectionDataFlow,
        dispatch: dispatch,
        package: packages?.entities[getFreePackageId().toLocaleUpperCase()],
        spec: spec,
        type: type
      });

      // console.log('Combined config data usefffect', combinedConfigData);

      if (oauthKeysData) {
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

  const handleSubmit = (data: any) => {
    console.log('handle submit:_', data);

    setStatus('submitting');

    const payload = {
      config: data
    };

    checkConnection(`/workspaces/${wid}/connectors/${type}/check`, payload);
  };

  const checkConnection = async (url: string, payload: any) => {
    await httpPostRequestHandler({
      route: apiRoutes['check'],
      url,
      payload,
      errorCb: (err) => {
        setStatus('error');

        handleAlertOpen({ message: err, alertType: 'error' });
      },
      successCb: async (res) => {
        const { connectionStatus: { status = '', message = '' } = {} } = res ?? {};
        if (status === 'FAILED') {
          setStatus('error');

          handleAlertOpen({ message: message, alertType: 'error' });
        } else {
          if (isConnectionAutomationFlow({ mode, type })) {
            // discover objects
            await discoverObjects();
          } else {
            const entities = {
              ...connectionDataFlow.entities,
              [getCredentialObjKey(type)]: {
                ...connectionDataFlow.entities[getCredentialObjKey(type)],
                //TODO : after check, get the name from the response and send it here instead displayName
                config: {
                  ...payload.config,
                  name: displayName
                }
              }
            };

            dispatch(setEntities(entities));
            setStatus('success');

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
      successCb: async (data) => {
        const results = data?.resultData ?? {};
        const filteredStreams = filterStreamsBasedOnScope(results, connectionDataFlow, type);

        let streams = [];

        for (let i = 0; i < filteredStreams.length; i++) {
          streams.push(generateStreamObj(filteredStreams[i], 'stream'));
        }

        await handleConnectionOnCreate(streams);
      },
      errorCb: (err) => {
        setStatus('error');

        handleAlertOpen({ message: err, alertType: 'error' });
      }
    });
  };

  const handleConnectionOnCreate = async (streams: any) => {
    const schedulePayload = {
      name: type?.toLocaleLowerCase(),
      run_interval: 'Every 1 hour'
    };

    const { formValues: sourceCredentials = {} } = oAuthConfigData ?? {};

    const payload = generateConnectionPayload({
      sourceCredentials: sourceCredentials,
      extras: connectionDataFlow?.entities[getExtrasObjKey()] ?? {},
      streams: streams,
      isEditableFlow: isEditableFlow,
      schedulePayload: schedulePayload,
      type: type,
      user: session?.user ?? {},
      workspaceId: wid
    });

    console.log('generateConnectionPayload payload:_', payload);
    const query = getConnectionQuery({ type: type, isEditableFlow: isEditableFlow });

    await queryHandler({
      query: query,
      payload: payload,
      successCb: (data: any) => {
        setStatus('success');
        handleAlertOpen({ message: 'Connection created successfully!', alertType: 'success' });
        // dispatch(clearConnectionFlowState());
        router.push(`/spaces/${wid}/connections`);
      },
      errorCb: (err) => {
        setStatus('error');

        handleAlertOpen({ message: err, alertType: 'error' });
      }
    });
  };

  const getConnectionQuery = ({ isEditableFlow, type }: { isEditableFlow: boolean; type: string }) => {
    if (type === getShopifyIntegrationType()) {
      // TODO: handle update default warehouse connection
      return !isEditableFlow ? createDefaultWarehouseConnection : updateConnection;
    } else {
      return !isEditableFlow ? createConnection : updateConnection;
    }
  };

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  return (
    <ConnectorLayout title={`Connect to ${displayName}`}>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        displayButton={false}
        isError={alertState.type === 'error'}
      />
      <IntegrationSpec
        error={combinedConfigError}
        isLoading={combinedConfigIsLoading}
        traceError={combinedConfigTraceError}
        specData={combinedConfigData?.spec ?? undefined}
        handleSubmit={handleSubmit}
        status={status}
        key={'IntegrationSpec'}
      />
    </ConnectorLayout>
  );
};

export default ConnectionConfig;
