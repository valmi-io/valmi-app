// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

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
  let payload = {};
  if (!isEditableFlow) {
    payload = {
      src: generateSourcePayload(flowState),
      dest: generateDestinationPayload(flowState),
      schedule: {
        run_interval:
          getSchedule(flowState).value *
          (getSchedule(flowState).type == HOUR ? 3600 : 60) *
          1000 // inteval in milliseconds.
      },
      uiState: {
        steps: flowState.steps.slice(flowState.isEditableFlow ? 0 : 2),
        sourceCatalog: flowState.sourceCatalog,
        destinationCatalog: flowState.destinationCatalog
      },
      syncName: getSyncName(flowState),
      workspaceId: workspaceId
    };
  } else {
    const {
      syncId = '',
      source: { id: sourceId = '' } = {},
      destination: { id: destinationId = '' } = {}
    } = extra || {};
    payload = {
      syncId: syncId,
      sourceId: sourceId,
      destinationId: destinationId,
      schedule: {
        run_interval:
          getSchedule(flowState).value *
          (getSchedule(flowState).type == HOUR ? 3600 : 60) *
          1000 // inteval in milliseconds.
      },
      uiState: {
        steps: flowState.steps.slice(flowState.isEditableFlow ? 0 : 2),
        sourceCatalog: flowState.sourceCatalog,
        destinationCatalog: flowState.destinationCatalog
      },
      // destination_catalog: generateDestinationPayload(flowState)
      syncName: getSyncName(flowState),
      workspaceId: workspaceId
    };
  }
  return payload;
};

export const generateSourcePayload = (flowState) => {
  const { json_schema, name, supported_sync_modes } = flowState.sourceCatalog;

  const { id: credential_id, name: sourceName } = flowState.sourceCredentialId;

  // Generate Source props
  const mapping = getMapping(flowState);

  let sourceProps = {};
  const unknownType = {
    type: 'NOT_FILLED'
  };
  sourceProps[getSourceIdKey(flowState)] = unknownType;
  mapping.forEach((mapElement) => {
    if (
      mapElement.destinationField !== null &&
      mapElement.destinationField.trim() !== '' &&
      mapElement.sourceField !== null &&
      mapElement.sourceField.trim() !== ''
    )
      sourceProps[mapElement.sourceField] = unknownType;
  });

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
    credential_id,
    name: sourceName
  };

  return sourcePayload;
};

export const generateDestinationPayload = (flowState) => {
  const { destinationCatalog } = flowState;

  const { id: destinationId, name: destinationName } =
    flowState.destinationCredentialId;

  // let sprucedMapping = {};
  let sprucedMapping = [];
  getMapping(flowState).forEach((mapElement) => {
    if (
      mapElement.destinationField !== null &&
      mapElement.destinationField.trim() !== '' &&
      mapElement.sourceField !== null &&
      mapElement.sourceField.trim() !== ''
    )
      sprucedMapping.push({
        stream: mapElement.sourceField,
        sink: mapElement.destinationField
      });
    //sprucedMapping[mapElement.sourceField] = mapElement.destinationField;
  });

  let template_fields = {};

  getTemplateMapping(flowState).forEach((mapElement) => {
    template_fields = {
      ...template_fields,
      [mapElement.name]: mapElement.value
    };
  });

  const destinationPayload = {
    catalog: {
      sinks: [
        {
          mapping: sprucedMapping,
          template_fields: template_fields,
          destination_sync_mode: getSelectedDestinationMode(flowState),
          destination_id: getDestinationIdKey(flowState),
          sink: destinationCatalog
        }
      ]
    },
    credential_id: destinationId,
    name: destinationName
  };

  return destinationPayload;
};
