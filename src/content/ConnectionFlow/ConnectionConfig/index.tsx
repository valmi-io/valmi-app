import { useContext, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ConnectorLayout from '@layouts/ConnectorLayout';

import { AppDispatch } from '@store/store';
import { getCredentialsSelectors, useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import { useWizard } from 'react-use-wizard';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/data-flows/create';
import { httpPostRequestHandler, queryHandler } from '@/services';
import { apiRoutes, redirectToCredentials } from '@/utils/router-utils';
import { OAuthContext } from '@/contexts/OAuthContext';
import {
  getCredentialObjKey,
  getSelectedConnectorKey,
  getFreePackageId,
  generateConnectionPayload,
  getShopifyIntegrationType,
  isETLFlow,
  getExtrasObjKey,
  filterStreamsBasedOnScope,
  initializeConnectionFlowState,
  generateFormStateFromSpec,
  generateCredentialPayload,
  AUTOMATE_INTEGRATION_DISCOVERY
} from '@/utils/connectionFlowUtils';
import { flattenObject, isObjectEmpty } from '@/utils/lib';
import {
  generateConfiguredStreams,
  generateStreamObj
} from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
import { useRouter } from 'next/router';
import {
  useLazyCreateConnectionQuery,
  useLazyCreateDefaultWarehouseConnectionQuery,
  useLazyUpdateConnectionQuery
} from '@/store/api/connectionApiSlice';
import { useIntegrationQuery } from '@/content/ConnectionFlow/useIntegrationQuery';
import IntegrationSpec from '@/content/ConnectionFlow/IntegrationSpec';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { FormStatus } from '@/utils/form-utils';
import { useUser } from '@/hooks/useUser';
import { getOAuthParams } from '@/utils/oauth-utils';

const ConnectionConfig = ({ params, isEditableFlow = false }: TConnectionUpsertProps) => {
  const { wid = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user } = useUser();

  const { nextStep } = useWizard();

  let { formState, setFormState } = useContext(OAuthContext);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const {
    type = '',
    display_name: displayName = '',
    oauth_keys: oauthKeys = '',
    mode = '',
    oauth_params: oAuthParams = {}
  } = selectedConnector;

  const { config = {}, account = {} } = connectionDataFlow.entities[getCredentialObjKey(type)] ?? {};

  const { id: credentialId = '' } = config ?? {};

  // Getting credential selectors for editing case specifically - not useful for create case
  const { selectCredentialById } = getCredentialsSelectors(wid as string);
  const credentialData = useSelector((state) => selectCredentialById(state, credentialId));

  // discover call query
  const [fetchObjects] = useLazyDiscoverConnectorQuery();

  //create connection query
  const [createConnection] = useLazyCreateConnectionQuery();

  //create default warehouse connection query
  const [createDefaultWarehouseConnection] = useLazyCreateDefaultWarehouseConnectionQuery();

  // update connection query
  const [updateConnection] = useLazyUpdateConnectionQuery();

  const { data, error, isLoading, traceError } = useIntegrationQuery({
    type: type,
    workspaceId: wid,
    isEditableFlow: isEditableFlow
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

      // initializing connection flow state.
      initializeConnectionFlowState({
        connectionDataFlow: connectionDataFlow,
        dispatch: dispatch,
        package: isEditableFlow ? [] : packages?.entities[getFreePackageId().toLocaleUpperCase()],
        spec: spec,
        oauthCredentials: oauthCredentials,
        type: type
      });
    }
  }, [data]);

  useEffect(() => {
    if (oAuthParams && !isObjectEmpty(oAuthParams)) {
      const currentFormState = connectionDataFlow.entities[getSelectedConnectorKey()]?.formValues || {};
      storeOAuthState(currentFormState, oAuthParams);
    }
  }, [oAuthParams]);

  /**
   * Stores state consisting of current form state and OAuth response in connectionForm context.
   * @param currentFormState The current state of the form.
   * @param oauthResponse The response received from OAuth.
   */
  const storeOAuthState = (currentFormState: any, oauthResponse: any) => {
    const formAndOAuthState = flattenObject({
      ...currentFormState,
      ...getOAuthParams(oauthResponse)
    });

    const { spec = null } = connectionDataFlow.entities[getCredentialObjKey(type)];

    const updatedFormState = generateFormStateFromSpec(spec, formAndOAuthState, type);

    setFormState(updatedFormState);
  };

  // STATE: Trigger to get into Checking Credential State - BEGIN
  const handleSubmit = (data: any) => {
    setStatus('submitting');

    const payload: any = {
      config: data
    };

    checkConnection(`/workspaces/${wid}/connectors/${type}/check`, payload);
  };

  const checkConnection = async (url: string, payload: any) => {
    await httpPostRequestHandler({
      route: apiRoutes['checkURL'],
      url,
      payload,
      errorCb: handleConnectionError,
      successCb: (res) => handleConnectionSuccess(res, payload)
    });
  };

  const handleConnectionSuccess = async (res: any, payload: any) => {
    const { connectionStatus: { status = '', message = '' } = {} } = res ?? {};
    if (status === 'FAILED') {
      setStatus('error');

      handleAlertOpen({ message: message, alertType: 'error' });
    } else {
      console.log('isEditable flow:_', isEditableFlow);
      if (isEditableFlow) {
        const userAccount = { ...user, id: account.id };
        const payload = generateCredentialPayload({
          credentialConfig: formState,
          type,
          user: userAccount,
          isEditableFlow: isEditableFlow
        });

        console.log('payload', payload);

        handleCredentialUpdate(wid, payload);
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

        if (!isETLFlow({ mode, type })) {
          setStatus('success');
          nextStep();
        }
      }
    }
  };

  const handleCredentialUpdate = async (workspaceId: string, payload: any) => {
    const credentialUpdateURL = `/workspaces/${workspaceId}/credentials/update`;
    console.log('payload:_', payload);
    await httpPostRequestHandler({
      route: apiRoutes['connectionURL'],
      url: credentialUpdateURL,
      payload,
      errorCb: handleCredentialUpdateError,
      successCb: handleCredentialUpdateSuccess
    });
  };

  const handleCredentialUpdateError = (err: unknown) => {
    setStatus('error');
    handleAlertOpen({ message: err, alertType: 'error' });
  };

  const handleCredentialUpdateSuccess = (res: any) => {
    setStatus('success');
    handleAlertOpen({ message: 'Credential updated successfully!', alertType: 'success' });
    const type = displayName.toLowerCase();
    redirectToCredentials({ router, wid, type });
  };

  const handleConnectionError = (err: any) => {
    setStatus('error');
    handleAlertOpen({ message: err, alertType: 'error' });
  };

  //STATE: Checking Credential - END

  // STATE: Discover State - BEGIN
  useEffect(() => {
    // This object is set on completion of check Query
    if (!isEditableFlow && connectionDataFlow.entities[getCredentialObjKey(type)]?.config) {
      // if config exists in connectionDataFlow then run discover call -- but do it only once.
      discoverState().run();
    }
  }, [isEditableFlow, connectionDataFlow.entities[getCredentialObjKey(type)]?.config]);

  const discoverState = () => {
    //
    // listen to entities on redux
    // and do discover query  and set response in redux
    // discovering integration objects
    return {
      run: async () => {
        const payload = {
          config: connectionDataFlow.entities[getCredentialObjKey(type)]?.config ?? {},
          workspaceId: wid,
          connectorType: type,
          queryId: 1
        };

        await queryHandler({
          query: fetchObjects,
          payload: payload,
          successCb: async (data) => {
            // discover results
            const results = data?.resultData ?? {};
            // filtered discover objects based on the integration type & package scopes.
            const streams = filterStreamsBasedOnScope(results, connectionDataFlow, type);
            // list of configured objects or streams
            const configuredStreams = generateConfiguredStreams(streams);
            await createConnectionState().run(configuredStreams);
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
          user: user ?? {},
          workspaceId: wid
        });

        const query = getConnectionQuery({ type: type, isEditableFlow: isEditableFlow });

        await queryHandler({
          query: query,
          payload: payload,
          successCb: (data: any) => {
            setStatus('success');
            handleAlertOpen({ message: 'Connection created successfully!', alertType: 'success' });
            router.push(`/spaces/${wid}/data-flows`);
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
    if (type && AUTOMATE_INTEGRATION_DISCOVERY.includes(type)) {
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
    <ConnectorLayout title={`CONNECT TO ${displayName?.toUpperCase()}`}>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
      <IntegrationSpec
        error={error}
        isLoading={isLoading}
        traceError={traceError}
        specData={data?.spec ?? undefined}
        handleSubmit={handleSubmit}
        status={status}
        isEditableFlow={isEditableFlow}
        key={'IntegrationSpec'}
      />
    </ConnectorLayout>
  );
};

export default ConnectionConfig;
