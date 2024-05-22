import { Step } from '@/components/Stepper';
import constants from '@/constants';
import { ConnectorType, NewConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import { generateAccountPayload } from '@/utils/account-utils';
import { isObjectEmpty } from '@/utils/lib';
import { TData } from '@/utils/typings.d';

export type TStream = {
  name: string;
  json_schema: any;
  supported_sync_modes: string[];
  source_defined_cursor?: boolean;
  default_cursor_field?: string[];
  source_defined_primary_key?: string[][];
  namespace?: string;
};

export type TConfiguredStream = {
  stream: TStream;
  sync_mode: string;
  cursor_field?: string[];
  destination_sync_mode: string;
  primary_key?: string[][] | string[];
};

export type TConfiguredCatalog = {
  catalog: {
    streams: TConfiguredStream[];
  };
};

export const connectionScheduleSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the connection'
    },
    run_interval: {
      type: 'string',
      enum: [
        'Every 1 minute',
        'Every 2 minutes',
        'Every 5 minutes',
        'Every 15 minutes',
        'Every 30 minutes',
        'Every 1 hour'
      ],
      description: 'Connection interval'
    }
  },
  required: ['name', 'run_interval']
};

export const getSelectedConnectorObj = (item: ConnectorType, key: string) => {
  const obj: { type: string; display_name: string; oauth: boolean; oauth_keys: string; mode: string } = {
    type: item.type ?? item.connector_type ?? {},
    display_name: item.display_name,
    oauth: !!item.oauth,
    oauth_keys: item.oauth_keys ?? '',
    mode: item.mode ? item.mode[0] : ''
  };

  return obj;
};

export const generateCredentialPayload = (credentialConfig: any, type: string, user: any) => {
  const { name, ...config } = credentialConfig;
  const payload = {
    connector_type: type,
    connector_config: config,
    name: name,
    account: generateAccountPayload(user)
  };

  return payload;
};

export const generateConnectionPayload = ({
  sourceCredentials,
  streams,
  extras,
  user,
  isEditableFlow,
  schedulePayload,
  type,
  workspaceId
}: {
  sourceCredentials: any;
  extras: any;
  streams: any;
  user: any;
  type: string;
  schedulePayload: { name: string; run_interval: string };
  workspaceId: string;
  isEditableFlow: boolean;
}) => {
  let payload: Record<string, any> = {};

  const { name = '', run_interval = '' } = schedulePayload ?? {};

  if (type === getShopifyIntegrationType()) {
    // TODO: handle for isEditableFlow=true
    const { name, ...config } = sourceCredentials;
    payload = {
      workspaceId: workspaceId,
      connectionPayload: {
        account: generateAccountPayload(user),
        source: {
          config: config,
          catalog: generateSourcePayload(streams, isEditableFlow, extras)?.catalog
        },
        name: config?.shop ?? name
      }
    };
    return payload;
  }

  //TODO: handle payload for regular connections.
  let credentialPayload = null;
  let destCredentialPayload = null;

  payload = {
    workspaceId: workspaceId,
    connectionPayload: {
      src: generateSourcePayload(streams, isEditableFlow, extras),
      dest: generateDestinationPayload(streams, isEditableFlow, extras),
      schedule: { run_interval: getRunInterval(run_interval) },
      uiState: {},
      connectionName: name
    }
  };

  if (isEditableFlow) {
    payload.connectionPayload.connId = extras?.connId ?? '';
  }

  if (!isEditableFlow) {
    credentialPayload = generateCredentialPayload(sourceCredentials, type, user);
    destCredentialPayload = generateCredentialPayload(sourceCredentials, 'DEST_POSTGRES-DEST', user);
    payload.credentialPayload = credentialPayload;
    payload.destCredentialPayload = destCredentialPayload;
  }

  return payload;
};

export const generateSourcePayload = (streams: any[], isEditableFlow: boolean, extras: any) => {
  const sourcePayload: any = {
    catalog: {
      streams: streams
    }
  };

  if (isEditableFlow) {
    sourcePayload['credential_id'] = extras?.sourceId ?? '';
    sourcePayload['name'] = extras?.sourceName ?? '';
  }

  return sourcePayload;
};

export const generateDestinationPayload = (streams: TConfiguredStream[], isEditableFlow: boolean, extras: any) => {
  const newStreams = streams.map((stream) => {
    let obj = { ...stream };
    if (!obj['primary_key']) {
      const primaryKey = obj['stream']['source_defined_primary_key']?.[0]?.[0] ?? '';
      obj['primary_key'] = [primaryKey];
    }
    return obj;
  });

  const obj: any = {
    catalog: { streams: newStreams }
  };
  if (isEditableFlow) {
    obj['credential_id'] = extras?.destinationId ?? '';
    obj['name'] = extras?.destinationName ?? '';
  }

  return obj;
};

const intervals = [
  { type: 'MIN', val: 1, name: 'Every 1 minute' },
  { type: 'MIN', val: 5, name: 'Every 5 minutes' },
  { type: 'MIN', val: 10, name: 'Every 10 minutes' },
  { type: 'MIN', val: 15, name: 'Every 15 minutes' },
  { type: 'MIN', val: 30, name: 'Every 30 minutes' },
  { type: 'HOUR', val: 1, name: 'Every 1 hour' }
];

const getRunInterval = (name: string) => {
  //@ts-ignore
  const { val = 0, type = '' } = intervals.find((int) => name === int.name);

  const runInterval = val * (type === 'HOUR' ? 3600 : 60) * 1000; // inteval in milliseconds.
  return runInterval;
};

export const getRunIntervalName = (run_interval: number) => {
  const minutes = Math.floor(run_interval / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  let val = 0;

  let type = '';

  if (hours >= 1) {
    val = hours;
    type = 'HOUR';
  } else {
    val = minutes;
    type = 'MIN';
  }

  //@ts-ignore
  const { name = '' } = intervals.find((int) => val === int.val && type === int.type);

  return name;
};

const etlConnectionSteps: Step[] = [
  {
    label: constants.connections.CONFIGURE_SOURCE,
    type: 'source_credential'
  },
  {
    label: constants.connections.SELECT_STREAMS,
    type: 'source_catalog'
  },
  {
    label: constants.connections.CONFIGURE_CONNECTION,
    type: 'schedule'
  }
];

const etlConnectionEditFlowSteps: Step[] = [
  {
    label: constants.connections.SELECT_STREAMS,
    type: 'source_catalog'
  },
  {
    label: constants.connections.CONFIGURE_CONNECTION,
    type: 'schedule'
  }
];

const rEtlConnectionSteps: Step[] = [
  {
    label: constants.connections.CONFIGURE_SOURCE,
    type: 'source_credential'
  },
  {
    label: constants.connections.SELECT_STREAMS,
    type: 'source_catalog'
  },
  {
    label: 'Configure destination',
    type: 'destination_credential'
  },
  {
    label: 'Select sinks',
    type: 'destination_catalog'
  },
  {
    label: constants.connections.CONFIGURE_CONNECTION,
    type: 'schedule'
  }
];

export type TConnectionFlowStep = {
  type: 'etl' | 'retl' | 'events';
  create: Step[];
  edit: Step[];
};

export const getConnectionFlowSteps = (mode: string, isEditableFlow: boolean) => {
  const steps: TConnectionFlowStep[] = [
    { type: 'etl', create: etlConnectionSteps, edit: etlConnectionEditFlowSteps },
    { type: 'retl', create: rEtlConnectionSteps, edit: rEtlConnectionSteps },
    { type: 'events', create: [], edit: [] }
  ];

  //@ts-ignore
  const { create = [], edit = [] } = steps?.find((step) => mode === step.type) ?? {};

  return isEditableFlow ? edit : create;
};

export const getSelectedConnectorKey = () => {
  return 'selected_connector';
};

const INTEGRATION_TYPES: any = {
  SRC: 'source',
  DEST: 'destination'
};

export const getCredentialObjKey = (integrationType: string) => {
  const key = INTEGRATION_TYPES[integrationType.split('_')[0]];

  return `${key}_credential`;
};

export const getCatalogObjKey = (integrationType: string) => {
  const key = INTEGRATION_TYPES[integrationType.split('_')[0]];

  return `${key}_catalog`;
};

export const getOAuthObjInStore = (item: NewConnectorType) => {
  const obj: { oauth_params: object; oauth_error: string } = {
    oauth_params: item?.oauth_params ?? {},
    oauth_error: item?.oauth_error ?? ''
  };

  return obj;
};

export const getScheduleObjKey = () => {
  return 'schedule';
};

export const getExtrasObjKey = () => {
  return 'extras';
};

export const getFreePackageId = () => {
  return 'p0';
};

export const getPremiuimPackageIds = () => {
  return ['p0', 'p1'];
};

export const getShopifyIntegrationType = () => {
  return 'SRC_SHOPIFY';
};

export const isConnectionAutomationFlow = ({ mode, type }: { mode: string; type: string }) => {
  return !!(mode === 'etl' && type === getShopifyIntegrationType());
};

// filtering streams based on scopes from package and setting filtered streams and dispatching to reducer state
export const filterStreamsBasedOnScope = (results: any, connectionDataFlow: any, type: string) => {
  const scopes = connectionDataFlow.entities[getCredentialObjKey(type)]?.package?.scopes;

  const rows = results?.catalog?.streams ?? [];

  const namesInScopes = scopes.map((item: string) => item.split('read_')[1]);

  const streams = rows.filter(({ name }: { name: string }) => {
    if (namesInScopes.includes(name)) return true;
  });

  return streams;
};

export const initializeConnectionFlowState = ({
  connectionDataFlow,
  dispatch,
  spec,
  package: scopes,
  oauthCredentials,
  type
}: {
  connectionDataFlow: any;
  dispatch: AppDispatch;
  spec: any;
  package: any;
  oauthCredentials: any;
  type: string;
}) => {
  const obj = {
    ...connectionDataFlow.entities,
    [getCredentialObjKey(type)]: {
      ...connectionDataFlow.entities[getCredentialObjKey(type)],
      spec: spec,
      package: scopes,
      oauthCredentials: oauthCredentials
    }
  };
  dispatch(setEntities(obj));
};

export const isOAuthConfigurationRequired = (oauthKeys: string) => oauthKeys === 'private';

export const isIntegrationConfigured = (data: TData, type: string) => {
  return !!data?.entities[type];
};

export const isIntegrationAuthorized = (oAuthParams: any, isEditableFlow: boolean) => {
  return !!((oAuthParams && !isObjectEmpty(oAuthParams)) || isEditableFlow);
};

export const generateConfigFromSpec = (spec: any, values: any) => {
  return createJsonObject(
    spec.spec.connectionSpecification.required,
    spec.spec.connectionSpecification.properties,
    values
  );
};

const createJsonObject = (required: any, properties_def: any, values: any) => {
  let obj: any = {};

  if (required) {
    for (const field of required) {
      if (properties_def[field].oneOf) {
        // Determine which oneOf schema to use based on the auth_method value
        const method = values?.credentials?.auth_method ?? '';
        const selectedSchema = properties_def[field].oneOf.find(
          (schema: any) => schema.properties.auth_method.const === method
        );

        // Merge nested credentials from top-level values
        const nestedValues = { ...values.credentials, ...extractNestedCredentials(values) };
        obj[field] = createJsonObject(selectedSchema?.required, selectedSchema?.properties, nestedValues);
      } else if (properties_def[field].type === 'object') {
        if (properties_def[field].required) {
          obj[field] = createJsonObject(
            properties_def[field].required,
            properties_def[field].properties,
            values[field]
          );
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

const extractNestedCredentials = (values: any) => {
  return {
    client_id: values.client_id,
    client_secret: values.client_secret,
    access_token: values.access_token
  };
};
