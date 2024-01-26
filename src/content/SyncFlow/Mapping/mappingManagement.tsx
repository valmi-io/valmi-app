// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { getStepsInSyncFlow } from '@content/SyncFlow/stateManagement';

import { checkIfPropExistsInObject, isObjectEmpty } from '@utils/lib';

export const getStep = (flowState) => {
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

export const getFullRefreshCompatibleModes = () => {
  return ['upsert', 'mirror', 'append', 'create'];
};

export const getIncrementalCompatibleModes = () => {
  return ['upsert', 'append', 'update'];
};

export const isMappingStep = (flowState) => {
  let stepsCopy = getStepsInSyncFlow(flowState);
  const subStepsCopy = stepsCopy[flowState.currentStep][0];
  return subStepsCopy.state === 'mappingState' ? true : false;
};

export const hasSupportedWarehouseModes = (flowState) => {
  const selectedWarehouseMode =
    destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];
  return selectedWarehouseMode?.supported_sync_modes?.length > 0 || false;
};

export const hasSupportedDestinationIds = (flowState, destinationCatalog) => {
  const selectedMode =
    destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];
  return selectedMode?.supported_destination_ids?.length > 0 || false;
};

export const hasFreeFormFields = (flowState, destinationCatalog) => {
  const selectedMode =
    destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];

  return selectedMode?.allow_freeform_fields || false;
};

export const hasMandatoryFields = (flowState, destinationMode) => {
  const { destinationCatalog = {} } = flowState || {};
  const selectedMode = destinationCatalog.field_catalog[destinationMode];
  return selectedMode?.mandatory_fields || false;
};

export const hasTemplateFields = (flowState, destinationCatalog) => {
  const selectedMode =
    destinationCatalog.field_catalog[getSelectedDestinationMode(flowState)];
  return selectedMode?.template_fields || false;
};

export const getSourceModes = (sourceCatalog) => {
  return sourceCatalog?.supported_sync_modes || [];
};

export const saveSelectedSourceMode = (flowState, sourceMode) => {
  const stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[getStep(flowState)][sourceModeStep]['sourceMode'] = sourceMode;

  // reset selected destination mode if exists
  if (getSelectedDestinationMode(flowState) !== '') {
    stepsCopy[getStep(flowState)][destinationModeStep]['destinationMode'] = '';
  }

  return { ...flowState, steps: stepsCopy };
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

const getDestinationCompatibleModes = (sourceMode, destinationModes) => {
  return destinationModes;
  // let compatibleModes = [];
  // const modes = new Set(destinationModes);
  // if (sourceMode === 'full_refresh') {
  //   compatibleModes = getFullRefreshCompatibleModes().filter((item) =>
  //     modes.has(item)
  //   );
  // } else if (sourceMode === 'incremental') {
  //   compatibleModes = getIncrementalCompatibleModes().filter((item) =>
  //     modes.has(item)
  //   );
  // }

  //return modes;
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

  const compatibleModes = getDestinationCompatibleModes(
    getSelectedSourceMode(flowState),
    destinationModes
  );

  return compatibleModes;
};

export const getSelectedDestinationMode = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][destinationModeStep].hasOwnProperty(
      'destinationMode'
    )
  )
    return flowState.steps[getStep(flowState)][destinationModeStep][
      'destinationMode'
    ];
  return '';
};

export const saveDestinationMode = (flowState, destinationMode) => {
  const stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[getStep(flowState)][destinationModeStep]['destinationMode'] =
    destinationMode;

  // checking if destination mode has template_fields
  if (showTemplatedMappings(flowState, destinationMode)) {
    const template_fields = getTemplatedMappingFields(
      flowState,
      destinationMode
    );

    // updating template_fields to sync flow state
    stepsCopy[getStep(flowState)][templateMappingStep]['templateMappingKey'] =
      template_fields;
  }

  // checking if destination mode has mandatory_fields
  if (hasMandatoryFields(flowState, destinationMode)) {
    // mandatory_fields
    const mandatory_fields = hasMandatoryFields(flowState, destinationMode);
    let mappingArr = [...getMapping(flowState)];

    // available source fields
    const { sourceCatalog = {} } = flowState || {};

    let sourceFields = getSourceFields(sourceCatalog);

    // creating a mapped mandatory field
    for (let i = 0; i < mandatory_fields.length; i++) {
      let sourceField = '';
      if (sourceFields.length > 0) {
        sourceField = sourceFields.includes(sourceFields[i])
          ? sourceFields[i]
          : sourceField[0];
      }
      mappingArr.push({
        sourceField: sourceField,
        destinationField: mandatory_fields[i],
        destinationFieldType: 'dropdown',
        required: true
      });
    }

    // updating fieldMapping to sync flow state
    stepsCopy[getStep(flowState)][fieldMappingStep]['fieldMappingKey'] =
      mappingArr;
  }

  return { ...flowState, steps: stepsCopy };
};

export const showCustomMappings = (flowState, destinationCatalog) => {
  const selectedDestinationMode = getSelectedDestinationMode(flowState);

  if (
    checkIfPropExistsInObject(
      destinationCatalog.field_catalog,
      selectedDestinationMode
    ) &&
    selectedDestinationMode !== ''
  ) {
    return (
      hasFreeFormFields(flowState, destinationCatalog) ||
      hasSupportedDestinationIds(flowState, destinationCatalog)
    );
  }

  return false;
};

export const getSourceFields = (sourceCatalog) => {
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
  let stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[getStep(flowState)][idMappingStep]['sourceIdKey'] = sourceIdKey;

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
    return hasSupportedDestinationIds(flowState, destinationCatalog);
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
  let stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[getStep(flowState)][idMappingStep]['destinationIdKey'] =
    destinationIdKey;

  return { ...flowState, steps: stepsCopy };
};

export const isThereAStepAhead = (flowState, currentStep) => {
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

  // check if destination catalog has mandatory fields.
  if (hasMandatoryFields(flowState, getSelectedDestinationMode(flowState))) {
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
  const stepsCopy = getStepsInSyncFlow(flowState);

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

export const enableCustomMappingItem = (flowState, itemType) => {
  const { destinationCatalog = {} } = flowState;

  if (itemType === 'dropdown') {
    const remainingDestinationFields = getRemainingDestinationFields(
      flowState,
      destinationCatalog,
      getMapping(flowState),
      ''
    );

    return (
      remainingDestinationFields.length > 0 &&
      !isLastFieldMappedEmpty(flowState)
    );
  } else if (itemType === 'free') {
    return (
      hasFreeFormFields(flowState, destinationCatalog) &&
      !isLastFieldMappedEmpty(flowState)
    );
  }
  return false;
};

export const isLastFieldMappedEmpty = (flowState) => {
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
      !isObjectEmpty(selectedMode.template_fields)
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
  const templatedFieldsArr = !isObjectEmpty(templatedFields)
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
  const stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[getStep(flowState)][templateMappingStep]['templateMappingKey'] =
    mapping;
  return { ...flowState, steps: stepsCopy };
};
