import { Step } from '@/components/Stepper';
import constants from '@/constants';
import { ConnectorType, NewConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { generateAccountPayload } from '@/utils/account-utils';

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
  const obj: { type: string; display_name: string; oauth: boolean; oauth_keys: string } = {
    type: item.type ?? item.connector_type ?? {},
    display_name: item.display_name,
    oauth: !!item.oauth,
    oauth_keys: item.oauth_keys ?? ''
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
  connectionDataFlow,
  user,
  isEditableFlow,
  schedulePayload,
  type,
  workspaceId
}: {
  connectionDataFlow: any;
  user: any;
  type: string;
  schedulePayload: { name: string; run_interval: string };
  workspaceId: string;
  isEditableFlow: boolean;
}) => {
  let payload: Record<string, any> = {};

  let credentialObj = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config ?? {};
  const streams = connectionDataFlow?.entities[getCatalogObjKey(type)]?.streams ?? {};

  const extras = connectionDataFlow?.entities[getExtrasObjKey()] ?? {};

  const { name = '', run_interval = '' } = schedulePayload ?? {};

  if (type === getShopifyIntegrationType()) {
    // TODO: handle for isEditableFlow=true
    const { name, ...config } = credentialObj;
    payload = {
      workspaceId: workspaceId,
      connectionPayload: {
        account: generateAccountPayload(user),
        source_connector_type: type,
        source_connector_config: config,
        name: config?.shop ?? name,
        source_catalog: generateSourcePayload(streams, isEditableFlow, extras),
        destination_catalog: generateSourcePayload(streams, isEditableFlow, extras),
        schedule: { run_interval: getRunInterval(run_interval) }
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
    credentialPayload = generateCredentialPayload(credentialObj, type, user);
    destCredentialPayload = generateCredentialPayload(credentialObj, 'DEST_POSTGRES-DEST', user);
    payload.credentialPayload = credentialPayload;
    payload.destCredentialPayload = destCredentialPayload;
  }

  return payload;
};

const generateSourcePayload = (streams: any[], isEditableFlow: boolean, extras: any) => {
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

const generateDestinationPayload = (streams: TConfiguredStream[], isEditableFlow: boolean, extras: any) => {
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
  const { create = [], edit = [] } = steps.find((step) => mode === step.type);

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

export const generateDefaultWarehouseConnectionPayload = ({}: { type: string }) => {
  return {};
};
