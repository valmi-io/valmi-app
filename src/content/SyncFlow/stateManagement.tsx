// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { setFlowState } from '../../store/reducers/syncFlow';
import { MappingState } from './Mapping/MappingState';
import { ConnectionSelectionState } from './Warehouse/ConnectionSelectionState';
import { DiscoverState } from './Warehouse/DiscoverState';
import { getSchedule, getSyncName } from './Schedule/scheduleManagement';

export function initialiseFlowState(dispatch, flowState, isEditableFlow) {
  const warehouseSteps = [
    {
      refreshKey: 'key_' + Math.random(),
      state: 'connectionSelectionState',
      stepNum: 0
    }
  ];

  if (!isEditableFlow) {
    let steps = [warehouseSteps];
    let currentStep = 0;
    let sourceCatalog = {};
    let destinationCatalog = {};

    dispatch(
      setFlowState({
        currentStep: currentStep,
        steps: steps,
        sourceCatalog: sourceCatalog,
        destinationCatalog: destinationCatalog,
        isEditableFlow: isEditableFlow
      })
    );
  } else {
    dispatch(
      setFlowState({
        ...flowState,
        currentStep: 0
      })
    );
  }
}

export const setCurrentStepInFlow = (dispatch, currentStep, flowState) => {
  dispatch(setFlowState({ ...flowState, currentStep: currentStep }));
};

export const getStepsInSyncFlow = (flowState) => {
  return flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );
};

export const setVarsinSubStep = (flowState, step, subStep, vars) => {
  const stepsCopy = flowState.steps.map((x) => [...x]);
  stepsCopy[step][subStep] = {
    ...stepsCopy[step][subStep],
    ...vars
  };

  return {
    ...flowState,
    steps: stepsCopy
  };
};

export const enableNext = (flowState) => {
  //TODO: check edit flow currentStep conditions
  if (
    flowState.currentStep < flowState.steps?.length - 1 ||
    isLastStepInSyncFlow(flowState)
  )
    return true;
  else return false;
};

export const getScheduleStep = (flowState) => {
  return flowState.isEditableFlow ? 1 : 3;
};

export const isLastStepInSyncFlow = (flowState) => {
  if (
    flowState.currentStep === getScheduleStep(flowState) &&
    getSchedule(flowState) &&
    getSyncName(flowState).trim() !== ''
  )
    return true;
  return false;
};

export const setResults = (updatedFlowState, results, step, subStep) => {
  const stepsCopy = updatedFlowState.steps.map((x) => [...x]);
  stepsCopy[step][subStep] = {
    ...stepsCopy[step][subStep],
    results: results
  };
  return {
    ...updatedFlowState,
    steps: stepsCopy
  };
};

export const getResults = (flowState, step, subStep) => {
  if (flowState.steps[step][subStep].hasOwnProperty('results'))
    return flowState.steps[step][subStep].results;
  return [];
};

export const setMyRefreshKey = (flowState, step, subStep, refreshKey) => {
  flowState.steps[step][subStep]['myRefreshKey'] = refreshKey;
  return flowState;
};

export const getMyRefreshKey = (flowState, step, subStep) => {
  if (flowState.steps[step][subStep].hasOwnProperty('myRefreshKey'))
    return flowState.steps[step][subStep]['myRefreshKey'];
  return '';
};

export const setSelectedValue = (
  flowState,
  step,
  subStep,
  selectedSourceStream
) => {
  const stepsCopy = getStepsInSyncFlow(flowState);

  stepsCopy[step][subStep]['selectedSourceStream'] = selectedSourceStream;
  return { ...flowState, steps: stepsCopy };
};

export const getCatalogLabel = (flowState, step, subStep) => {
  if (flowState.steps[step][subStep].hasOwnProperty('type'))
    return flowState.steps[step][subStep]['type'];
  return '';
};

export const getSelectedValue = (flowState, step, subStep) => {
  if (flowState.steps[step][subStep].hasOwnProperty('selectedSourceStream'))
    return flowState.steps[step][subStep]['selectedSourceStream'];
  return '';
};

export const changeStepsArray = (
  steps,
  currentStep,
  newSubSteps,
  clearSubsequentSteps
) => {
  if (clearSubsequentSteps) {
    steps = steps.slice(0, currentStep);
  }
  steps[currentStep] = newSubSteps;
  return steps;
};

export const syncFlowStateMap = {
  connectionSelectionState: (
    refreshKey,
    dispatch,
    flowState,
    otherState,
    next,
    step,
    subStep
  ) =>
    ConnectionSelectionState(
      refreshKey,
      dispatch,
      flowState,
      otherState,
      next,
      step,
      subStep
    ),
  discoverState: (
    refreshKey,
    dispatch,
    flowState,
    otherState,
    next,
    step,
    subStep
  ) =>
    DiscoverState(
      refreshKey,
      dispatch,
      flowState,
      otherState,
      next,
      step,
      subStep
    ),

  mappingState: (
    refreshKey,
    dispatch,
    flowState,
    otherState,
    next,
    step,
    subStep
  ) =>
    MappingState(
      refreshKey,
      dispatch,
      flowState,
      otherState,
      next,
      step,
      subStep
    )
};
