import { Step } from '@/components/Stepper';
import constants from '@/constants';
import { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';

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

const generateAccountPayload = (user: any) => {
  //@ts-ignore
  const { email = '', first_name = '' } = user || {};

  const payload = {
    name: first_name,
    external_id: email,
    profile: '',
    meta_data: {}
  };

  return payload;
};

export const generateConnectionPayload = (
  streams: any[],
  state: any,
  wid: string,
  isEditableFlow: boolean = false,
  extras: any
) => {
  let connectionPayload: any = {};

  const { name = '', run_interval = '' } = state ?? {};
  connectionPayload['src'] = generateSourcePayload(streams, isEditableFlow, extras);
  connectionPayload['dest'] = generateDestinationPayload(streams, isEditableFlow, extras);
  connectionPayload['schedule'] = { run_interval: getRunInterval(run_interval) };
  connectionPayload['uiState'] = {};
  connectionPayload['connectionName'] = name;

  connectionPayload['workspaceId'] = wid;

  if (isEditableFlow) {
    connectionPayload['connId'] = extras?.connId ?? '';
  }

  return connectionPayload;
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

export const getScheduleObjKey = () => {
  return 'schedule';
};

export const getExtrasObjKey = () => {
  return 'extras';
};
