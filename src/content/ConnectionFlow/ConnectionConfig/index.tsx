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
  initializeConnectionConfigDataFlow,
  isIntegrationConfigured,
  isOAuthConfigurationRequired,
  isIntegrationAuthorized
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
import { useIntegrationQuery } from '@/content/ConnectionFlow/useIntegrationQuery';
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

  let { oAuthConfigData, setOAuthConfigData, setIsOAuthStepDone, isoAuthStepDone } = useContext(OAuthContext);

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

  const { data, error, isLoading, traceError } = useIntegrationQuery({
    oauthKeys: oauthKeys,
    type: type,
    workspaceId: wid
  });

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  useEffect(() => {
    if (data) {
      const { spec, packages, oauthCredentials } = data ?? {};

      // initializing connection config data flow
      initializeConnectionConfigDataFlow({
        connectionDataFlow: connectionDataFlow,
        dispatch: dispatch,
        package: packages?.entities[getFreePackageId().toLocaleUpperCase()],
        spec: spec,
        oauthCredentials: oauthCredentials,
        type: type
      });

      if (oauthCredentials) {
        // console.log('trying to set OAuth data');
        // setOAuthData();
      }
    }
  }, [data]);

  // useEffect(() => {
  //   if (data && oAuthConfigData) {
  //     console.log('OAuth config data', { data, oAuthConfigData });
  //   }
  // }, [oAuthConfigData]);

  // const setOAuthData = () => {
  //   console.log('setting oauth data:_ ---------------');

  //   // console.log('Object', {
  //   //   isconfigured: isIntegrationConfigured(data?.oauthKeysData, type),
  //   //   requireConfiguration: isOAuthConfigurationRequired(oauthKeys),
  //   //   isAuthorized: isIntegrationAuthorized(selectedConnector?.oauth_params, isEditableFlow)
  //   // });

  //   setOAuthConfigData((oAuthConfigData: any) => ({
  //     ...oAuthConfigData,
  // isconfigured: isIntegrationConfigured(data?.oauthKeysData, type),
  // requireConfiguration: isOAuthConfigurationRequired(oauthKeys),
  // isAuthorized: isIntegrationAuthorized(selectedConnector?.oauth_params, isEditableFlow)
  //   }));
  // };

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

  // STATE: Trigger to get into Checking Credential State - BEGIN
  const handleSubmit = (data: any) => {
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
        console.log('Check credential is successfully done');

        const { connectionStatus: { status = '', message = '' } = {} } = res ?? {};
        if (status === 'FAILED') {
          setStatus('error');

          handleAlertOpen({ message: message, alertType: 'error' });
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

          if (!isConnectionAutomationFlow({ mode, type })) {
            setStatus('success');
            nextStep();
          }
        }
      }
    });
  };

  //STATE: Checking Credential - END

  // STATE: Discover State - BEGIN
  useEffect(() => {
    // This object is set on completion of check Query
    if (connectionDataFlow.entities[getCredentialObjKey(type)]?.config) {
      // if config exists in connectionDataFlow then run discover call -- but do it only once.
      discoverState().run();
    }
  }, [connectionDataFlow.entities[getCredentialObjKey(type)]?.config]);

  const discoverState = () => {
    //
    // listen to entities on redux
    // and do discover query  and set response in redux
    // discovering integration objects
    return {
      run: async () => {
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

            await createConnectionState().run(streams);
          },
          errorCb: (err) => {
            setStatus('error');

            handleAlertOpen({ message: err, alertType: 'error' });
          }
        });
      }
    };
  };

  // STATE: Discover State - END

  // STATE: Create Connection State - BEGIN
  const createConnectionState = () => {
    return {
      run: async (streams: any) => {
        const schedulePayload = {
          name: type?.toLocaleLowerCase(),
          run_interval: 'Every 1 hour'
        };

        const payload = generateConnectionPayload({
          sourceCredentials: connectionDataFlow?.entities[getCredentialObjKey(type)].config,
          extras: connectionDataFlow?.entities[getExtrasObjKey()] ?? {},
          streams: streams,
          isEditableFlow: isEditableFlow,
          schedulePayload: schedulePayload,
          type: type,
          user: session?.user ?? {},
          workspaceId: wid
        });

        const query = getConnectionQuery({ type: type, isEditableFlow: isEditableFlow });

        await queryHandler({
          query: query,
          payload: payload,
          successCb: (data: any) => {
            setStatus('success');
            handleAlertOpen({ message: 'Connection created successfully!', alertType: 'success' });
            router.push(`/spaces/${wid}/connections`);
          },
          errorCb: (err) => {
            setStatus('error');

            handleAlertOpen({ message: err, alertType: 'error' });
          }
        });
      }
    };
  };

  // STATE: Create Connection State - END
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
        error={error}
        isLoading={isLoading}
        traceError={traceError}
        specData={data?.spec ?? undefined}
        oauthCredentials={data?.oauthCredentials ?? undefined}
        handleSubmit={handleSubmit}
        status={status}
        isEditableFlow={isEditableFlow}
        key={'IntegrationSpec'}
      />
    </ConnectorLayout>
  );
};

export default ConnectionConfig;
