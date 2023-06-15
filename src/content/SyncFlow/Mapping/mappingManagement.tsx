// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { checkIfPropExistsInObject } from '../../../utils/lib';
import { getStepsInSyncFlow } from '../stateManagement';

const getStep = (flowState) => {
  return flowState.hasOwnProperty('isEditableFlow') && flowState.isEditableFlow
    ? 0
    : 2;
};

const sourceModeStep = 0;
const destinationModeStep = 1;
const idMappingStep = 2;
const fieldMappingStep = 3;
const templateMappingStep = 4;

export const getMappingStates = () => {
  const arr = new Array(6).fill(0);
  return arr.map((x, index) => {
    return {
      refreshKey: 'key_' + Math.random(),
      state: 'mappingState',
      stepNum: index
    };
  });
};

export const isMappingStep = (flowState) => {
  let stepsCopy = getStepsInSyncFlow(flowState);
  const subStepsCopy = stepsCopy[flowState.currentStep][0];
  return subStepsCopy.state === 'mappingState' ? true : false;
};

export const getSourceModes = (sourceCatalog, destinationCatalog) => {
  return sourceCatalog.supported_sync_modes;
};

export const getSelectedSourceMode = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][sourceModeStep].hasOwnProperty(
      'sourceMode'
    )
  )
    return flowState.steps[getStep(flowState)][sourceModeStep]['sourceMode'];
  return '';
};

export const saveSelectedSourceMode = (flowState, sourceMode) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][sourceModeStep]['sourceMode'] = sourceMode;
  return { ...flowState, steps: stepsCopy };
};

export const getFullRefreshCompatibleModes = () => {
  return ['upsert', 'mirror', 'append', 'create'];
};

export const getIncrementalCompatibleModes = () => {
  return ['upsert', 'append', 'update'];
};

const getCompatibleModes = (sourceMode, destinationModes) => {
  let compatibleModes = [];
  const modes = new Set(destinationModes);
  if (sourceMode === 'full_refresh') {
    compatibleModes = getFullRefreshCompatibleModes().filter((item) =>
      modes.has(item)
    );
  } else if (sourceMode === 'incremental') {
    compatibleModes = getIncrementalCompatibleModes().filter((item) =>
      modes.has(item)
    );
  }

  return compatibleModes;
};

export const getDestinationModes = (flowState, destinationCatalog) => {
  let destinationModes = [];
  if (checkIfPropExistsInObject(destinationCatalog, 'supported_sync_modes')) {
    destinationModes = destinationCatalog.supported_sync_modes;
  } else {
    checkIfPropExistsInObject(
      destinationCatalog,
      'supported_destination_sync_modes'
    );
    destinationModes = destinationCatalog.supported_destination_sync_modes;
  }

  const compatibleModes = getCompatibleModes(
    getSelectedSourceMode(flowState),
    destinationModes
  );

  return compatibleModes;
};

export const showCustomMappings = (flowState, destinationCatalog) => {
  return true;
  //TODO: Handle this better
  if (
    checkIfPropExistsInObject(
      destinationCatalog.field_catalog,
      getSelectedDestinationMode(flowState)
    )
  ) {
    const selectedMode =
      destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];

    return selectedMode?.allow_freeform_fields || false;
  }

  return false;
};

export const getSelectedDestinationMode = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][destinationModeStep].hasOwnProperty(
      'destinationMode'
    )
  )
    //TODO: check if destination mode exists, but has empty value.
    return flowState.steps[getStep(flowState)][destinationModeStep][
      'destinationMode'
    ];
  return '';
};

export const saveDestinationMode = (flowState, destinationMode) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][destinationModeStep]['destinationMode'] =
    destinationMode;

  if (showTemplatedMappings(flowState, destinationMode)) {
    const template_fields = getTemplatedMappingFields(
      flowState,
      destinationMode
    );

    stepsCopy[getStep(flowState)][templateMappingStep]['templateMappingKey'] =
      template_fields;
  }

  return { ...flowState, steps: stepsCopy };
};

export const getSourceFields = (sourceCatalog) => {
  //const sourceFields = Object.keys(sourceCatalog.json_schema.properties);

  return Object.keys(sourceCatalog.json_schema.properties);
};

export const getSourceIdKey = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][idMappingStep].hasOwnProperty(
      'sourceIdKey'
    )
  )
    return flowState.steps[getStep(flowState)][idMappingStep]['sourceIdKey'];
  return '';
};

export const saveSourceIdKey = (flowState, destinationCatalog, sourceIdKey) => {
  let stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][idMappingStep]['sourceIdKey'] = sourceIdKey;
  if (!isDestinationIdMappingRequired(flowState, destinationCatalog)) {
    // Enabling Next button
    if (!isThereAStepAhead(flowState, getStep(flowState))) {
      stepsCopy = [...stepsCopy, [{}]];
    }
  }

  return { ...flowState, steps: stepsCopy };
};

export const isDestinationIdMappingRequired = (
  flowState,
  destinationCatalog
) => {
  if (
    checkIfPropExistsInObject(
      destinationCatalog.field_catalog,
      getSelectedDestinationMode(flowState)
    )
  ) {
    const selectedMode =
      destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];
    return selectedMode?.supported_destination_ids?.length > 0 || false;
  }

  return false;
};

export const getDestinationFields = (flowState, destinationCatalog) => {
  if (isDestinationIdMappingRequired(flowState, destinationCatalog)) {
    return [
      ...destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)]
        .supported_destination_ids
    ];
  }
  return [];
};

export const getDestinationIdKey = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][idMappingStep].hasOwnProperty(
      'destinationIdKey'
    )
  )
    return flowState.steps[getStep(flowState)][idMappingStep][
      'destinationIdKey'
    ];
  return '';
};

export const saveDestinationIdKey = (flowState, destinationIdKey) => {
  let stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][idMappingStep]['destinationIdKey'] =
    destinationIdKey;

  // Enabling Next button.
  // check if there is a next step.
  if (!isThereAStepAhead(flowState, getStep(flowState))) {
    stepsCopy = [...stepsCopy, [{}]];
  }
  return { ...flowState, steps: stepsCopy };
};

const isThereAStepAhead = (flowState, currentStep) => {
  return currentStep < flowState.steps.length - 1;
};

export const getRemainingDestinationFields = (
  flowState,
  destinationCatalog,
  mapping,
  alreadyMappedField
) => {
  let all_fields = [];
  let selectedFieldCatalog = null;
  if (
    destinationCatalog.field_catalog.hasOwnProperty(
      getSelectedDestinationMode(flowState)
    ) &&
    destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)]
      .supported_destination_ids?.length > 0
  ) {
    all_fields = [
      ...destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)]
        .supported_destination_ids
    ];
    selectedFieldCatalog =
      destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];
  }
  if (
    selectedFieldCatalog &&
    selectedFieldCatalog.json_schema.hasOwnProperty('properties')
  ) {
    all_fields = [
      ...all_fields,
      ...Object.keys(selectedFieldCatalog.json_schema.properties)
    ];
  }
  const returnedFields = all_fields.filter((x) => {
    let ret_val = true;
    for (let i = 0; i < mapping.length; i++) {
      if (
        mapping[i].destinationField === x &&
        mapping[i].destinationField !== alreadyMappedField
      ) {
        ret_val = false;
        break;
      }
    }
    if (getDestinationIdKey(flowState) === x) {
      ret_val = false;
    }
    return ret_val;
  });

  return [...new Set(returnedFields)];
};

export const saveMapping = (flowState, mapping) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][fieldMappingStep]['fieldMappingKey'] = mapping;
  return { ...flowState, steps: stepsCopy };
};

export const getMapping = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][fieldMappingStep].hasOwnProperty(
      'fieldMappingKey'
    )
  )
    return flowState.steps[getStep(flowState)][fieldMappingStep][
      'fieldMappingKey'
    ];
  return [];
};

export const addNewItemToMap = (flowState, destinationFieldType) => {
  const mappingArr = [...getMapping(flowState)];
  mappingArr.push({
    sourceField: '',
    destinationField: '',
    destinationFieldType: destinationFieldType
  });
  return saveMapping(flowState, mappingArr);
};

export const deleteItemFromMap = (flowState, index) => {
  const mappingArr = [...getMapping(flowState)];
  mappingArr.splice(index, 1);
  return saveMapping(flowState, mappingArr);
};

export const updateItemInMap = (flowState, index, mapObj) => {
  const mappingArr = [...getMapping(flowState)];
  mappingArr[index] = mapObj;
  return saveMapping(flowState, mappingArr);
};

export const enableMappingItems = (flowState, itemType) => {
  return isLastFieldMappedIsEmpty(flowState) ? true : false;
};

export const isLastFieldMappedIsEmpty = (flowState) => {
  const mappingArr = getMapping(flowState);
  if (mappingArr.length < 1) return false;
  const lastMappedObj = mappingArr.slice(-1)[0];
  if (lastMappedObj.destinationField === '' || lastMappedObj.sourceField === '')
    return true;
  return false;
};

export const showTemplatedMappings = (flowState, destinationMode) => {
  const { destinationCatalog = {} } = flowState || {};

  if (
    checkIfPropExistsInObject(destinationCatalog.field_catalog, destinationMode)
  ) {
    const selectedMode = destinationCatalog.field_catalog[destinationMode];

    if (
      selectedMode &&
      selectedMode.template_fields &&
      Object.keys(selectedMode.template_fields).length > 0
    )
      return true;

    return false;
  }

  return false;
};

export const getTemplatedMappingFields = (flowState, destinationMode) => {
  if (showTemplatedMappings(flowState, destinationMode)) {
    const templated_fields =
      flowState.destinationCatalog.field_catalog[destinationMode]
        .template_fields;

    return processTemplatedMappingFields(templated_fields);
  }
  return [];
};

export const processTemplatedMappingFields = (templatedFields) => {
  const templatedFieldsArr = Object.keys(templatedFields).length
    ? Object.keys(templatedFields).map((key) => {
        const name = key;
        const label = templatedFields[key].label
          ? templatedFields[key].label
          : key;
        const type = templatedFields[key].type
          ? templatedFields[key].type
          : 'unknown';
        const required = templatedFields[key].required
          ? templatedFields[key].required
          : false;
        const description = templatedFields[key].description
          ? templatedFields[key].description
          : 'description';
        const value = '';

        return {
          name,
          label,
          value,
          type,
          required,
          description
        };
      })
    : [];

  return templatedFieldsArr;
};

export const updateItemInTemplate = (flowState, index, mapObj) => {
  const mappingArr = [...getTemplateMapping(flowState)];
  mappingArr[index] = mapObj;

  return saveTemplateMapping(flowState, mappingArr);
};

export const getTemplateMapping = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][templateMappingStep].hasOwnProperty(
      'templateMappingKey'
    )
  )
    return flowState.steps[getStep(flowState)][templateMappingStep][
      'templateMappingKey'
    ];
  return [];
};

export const saveTemplateMapping = (flowState, mapping) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][templateMappingStep]['templateMappingKey'] =
    mapping;
  return { ...flowState, steps: stepsCopy };
};
