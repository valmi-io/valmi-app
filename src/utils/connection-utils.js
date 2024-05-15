/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, June 15th 2023, 5:37:47 pm
 * Author: Nagendra S @ valmi.io
 */

import { getOAuthParams } from 'pages/auth/callback';

import { isConnectorRequiresOAuth } from '@/content/ConnectionFlow/ConnectionConfig/ConnectionConfigUtils';
import { ConnectionType } from '@content/Connections/ConnectionModel';

import { setConnectionFlow } from '@store/reducers/connectionFlow';

export const getInitialConnectionFlowState = (connection_flow, isInitialState) => {
  const { flowState: { connection_type = ConnectionType.SRC, steps = 0, currentStep = 0 } = {} } = connection_flow;
  const isEditableFlow = false;
  return {
    connection_type: connection_type,
    isEditableFlow: isEditableFlow,
    steps: isInitialState ? 0 : steps,
    currentStep: isInitialState ? 0 : currentStep
  };
};

export const initialiseConnectionFlowState = (dispatch, connection_flow, connection_type) => {
  const isInitialState = true;
  dispatch(
    setConnectionFlow({
      ...getInitialConnectionFlowState(connection_flow, isInitialState),
      connection_type: connection_type
    })
  );
};

export const initialiseConnectorSelectionState = (dispatch, connection_flow) => {
  const { flowState: { selected_connector = null } = {} } = connection_flow;

  dispatch(
    setConnectionFlow({
      ...getInitialConnectionFlowState(connection_flow),
      selected_connector: selected_connector
    })
  );
};

export const generateConfigFromSpec = (spec, values) => {
  return createJsonObject(
    spec.spec.connectionSpecification.required,
    spec.spec.connectionSpecification.properties,
    values
  );
};

const createJsonObject = (required, properties_def, values) => {
  let obj = {};

  if (required) {
    for (const field of required) {
      if (properties_def[field].type == 'object') {
        if (properties_def[field].required) {
          obj[field] = createJsonObject(properties_def[field].required, properties_def[field].properties, values);
        } else {
          obj[field] = values[field];
        }
      } else {
        obj[field] = values[field];
      }
    }
  }

  return obj;
};

export const enableBack = (connectionFlowState) => {
  const { currentStep = 0 } = connectionFlowState.flowState;

  if (currentStep > 0) return true;
  return false;
};

export const enableNext = (connectionFlowState) => {
  const { currentStep = 0, steps = 0, lastStep = false, isEditableFlow = false } = connectionFlowState.flowState;

  if (currentStep < steps || currentStep === (isEditableFlow ? 0 : 1) || lastStep) return true;
  return false;
};

export const setCurrentStepInConnectionFlow = (dispatch, currentStep, connectionFlowState) => {
  dispatch(
    setConnectionFlow({
      ...connectionFlowState.flowState,
      currentStep: currentStep,
      lastStep: false
    })
  );
};

export const setConnectorConfigInConnectionFlow = (dispatch, values, connectionFlowState) => {
  const { currentStep = 0, oauth_params = {}, connector_spec = {} } = connectionFlowState.flowState;

  let combinedValues = {
    ...values,
    ...getOAuthParams(oauth_params)
  };

  let config = generateConfigFromSpec(connector_spec, combinedValues);

  dispatch(
    setConnectionFlow({
      ...connectionFlowState.flowState,
      connector_config: config,
      connection_title: values.title,
      steps: currentStep + 1,
      currentStep: currentStep + 1
    })
  );
};

export const setOAuthErrorInConnectionFlow = (dispatch, connectorConfig, connectionTitle, connectionFlowState) => {
  const { currentStep = 0 } = connectionFlowState.flowState;
  dispatch(
    setConnectionFlow({
      ...connectionFlowState.flowState,
      connector_config: connectorConfig,
      connection_title: connectionTitle,
      steps: currentStep + 1,
      currentStep: currentStep + 1
    })
  );
};

export const generateConnectionPayload = (connection_flow, user) => {
  const {
    isEditableFlow = false,
    selected_connector = {},
    connector_config = {},
    connection_data = {},
    connection_title = ''
  } = connection_flow || {};
  const { id: connectionId = '' } = connection_data || {};
  const payload = {
    connector_type: selected_connector ? selected_connector.type : '',
    connector_config: connector_config,
    name: connection_title,
    account: generateAccountPayload(connection_flow, user, isEditableFlow)
  };

  return { ...(isEditableFlow && { id: connectionId }), ...payload };
};

export const generateAccountPayload = (connection_flow, user, isEditableFlow) => {
  const { connector_spec = null, oauth_params = {}, connection_data = null } = connection_flow || {};
  let payload = {};
  const { account: { id: accountId = '' } = {} } = connection_data || {};
  // if connector requires oAuth, then payload will be created from oAuth params.
  if (isConnectorRequiresOAuth(connector_spec)) {
    const { unique_id = '', name = '', image = '' } = oauth_params || {};

    payload = {
      name: name,
      external_id: unique_id,
      profile: image,
      meta_data: {},
      ...(isEditableFlow && { id: accountId })
    };
  } else {
    const { email = '', first_name = '' } = user || {};

    payload = {
      name: first_name,
      external_id: email,
      profile: '',
      meta_data: {},
      ...(isEditableFlow && { id: accountId })
    };
  }

  return payload;
};
