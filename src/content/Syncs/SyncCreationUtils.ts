// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { generateObjectHash } from '../../utils/lib';
import {
  getDestinationIdKey,
  getMapping,
  getSourceIdKey,
  getTemplateMapping
} from '../SyncFlow/Mapping/mappingManagement';
import {
  getSelectedDestinationMode,
  getSelectedSourceMode
} from '../SyncFlow/Mapping/mappingManagement';
import { HOUR, getSyncName } from '../SyncFlow/Schedule/scheduleManagement';
import { getSchedule } from '../SyncFlow/Schedule/scheduleManagement';

export const generateSyncPayload = (flowState, workspaceId) => {
  const { isEditableFlow = false, extra = null } = flowState;

  let syncPayload = {};

  syncPayload['src'] = generateSourcePayload(flowState, isEditableFlow);
  syncPayload['dest'] = generateDestinationPayload(flowState, isEditableFlow);
  syncPayload['schedule'] = { run_interval: getRunInterval(flowState) };
  syncPayload['uiState'] = generateUIState(flowState);
  syncPayload['syncName'] = getSyncName(flowState);
  syncPayload['workspaceId'] = workspaceId;

  if (isEditableFlow) {
    const { syncId = '' } = extra || {};
    syncPayload['syncId'] = syncId;
  }

  return syncPayload;
};

// this is an optional state and can be extended
const generateUIState = (flowState) => {
  let uiState = {
    steps: flowState.steps.slice(flowState.isEditableFlow ? 0 : 2),
    sourceCatalog: flowState.sourceCatalog,
    destinationCatalog: flowState.destinationCatalog,
    mapHash: generateObjectHash(generateFieldsMapping(flowState, {}, true))
  };
  return uiState;
};

const getRunInterval = (flowState) => {
  const runInterval =
    getSchedule(flowState).value *
    (getSchedule(flowState).type == HOUR ? 3600 : 60) *
    1000; // inteval in milliseconds.
  return runInterval;
};

const isElementFieldsMapped = (element) => {
  if (
    element.destinationField !== null &&
    element.destinationField.trim() !== '' &&
    element.sourceField !== null &&
    element.sourceField.trim() !== ''
  ) {
    return true;
  }
  return false;
};

const generateFieldsMapping = (
  flowState,
  unknownType,
  isDestinationPayload
) => {
  const mapping = getMapping(flowState);

  let fieldsMapped = {};

  if (isDestinationPayload) {
    fieldsMapped = [];
  }

  mapping.forEach((element) => {
    if (isElementFieldsMapped(element)) {
      if (!isDestinationPayload) {
        fieldsMapped[element.sourceField] = unknownType;
      } else {
        fieldsMapped.push({
          stream: element.sourceField,
          sink: element.destinationField
        });
      }
    }
  });

  return fieldsMapped;
};

const generateTemplateFieldsMapping = (flowState) => {
  const mapping = getTemplateMapping(flowState);

  let templateFields = {};

  mapping.forEach((element) => {
    templateFields = {
      ...templateFields,
      [element.name]: element.value
    };
  });

  return templateFields;
};

export const generateSourcePayload = (flowState, isEditableFlow) => {
  const {
    sourceCatalog: { json_schema, name, supported_sync_modes } = {},
    extra = null
  } = flowState || {};

  const { id: credentialId, name: credentialName } = isEditableFlow
    ? extra?.source.credential || {}
    : flowState.sourceConfig;

  let sourceProps = {};
  const unknownType = {
    type: 'NOT_FILLED'
  };

  sourceProps[getSourceIdKey(flowState)] = unknownType;

  sourceProps = {
    ...sourceProps,
    ...generateFieldsMapping(flowState, unknownType, false)
  };

  const sourcePayload = {
    catalog: {
      streams: [
        {
          sync_mode: getSelectedSourceMode(flowState),
          destination_sync_mode: getSelectedDestinationMode(flowState),
          id_key: getSourceIdKey(flowState),
          stream: {
            name,
            supported_sync_modes,
            json_schema: {
              $schema: json_schema.$schema,
              properties: sourceProps
            }
          }
        }
      ]
    },
    credential_id: credentialId,
    name: credentialName
  };

  return sourcePayload;
};

export const generateDestinationPayload = (flowState, isEditableFlow) => {
  const { destinationCatalog = {}, extra = null } = flowState || {};

  const { id: credentialId, name: credentialName } = isEditableFlow
    ? extra?.destination.credential || {}
    : flowState.destinationConfig;

  // fields mapping
  let sprucedMapping = generateFieldsMapping(flowState, {}, true);

  // template fields mapping
  let templateFields = generateTemplateFieldsMapping(flowState);

  const destinationPayload = {
    catalog: {
      sinks: [
        {
          mapping: sprucedMapping,
          template_fields: templateFields,
          destination_sync_mode: getSelectedDestinationMode(flowState),
          destination_id: getDestinationIdKey(flowState),
          sink: destinationCatalog
        }
      ]
    },
    credential_id: credentialId,
    name: credentialName
  };

  return destinationPayload;
};
