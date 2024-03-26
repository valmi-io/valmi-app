// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 7:52:18 pm
 * Author: Nagendra S @ valmi.io
 */

import CatalogSelectionComponent from '@content/SyncFlow/CatalogSelectionComponent';
import {
  setSelectedValue,
  setVarsinSubStep
} from '@content/SyncFlow/stateManagement';

import { useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';

export function DiscoverState(
  refreshKey,
  dispatch,
  flowState,
  otherState,
  next,
  step,
  subStep
) {
  const { sourceConfig, destinationConfig } = flowState;

  const resultFilter = (results) => {
    if (step === 0) {
      return results.catalog.streams;
    } else {
      return results.catalog.sinks;
    }
  };

  const updatedFlowStateAfterQuery = (results) => {
    const updatedFlowState = setVarsinSubStep(flowState, step, subStep, {
      more: results.catalog.more ? results.catalog.more : false,
      type: results.catalog.type ? results.catalog.type : '',
      allow_object_creation: results.catalog.allow_object_creation ? results.catalog.allow_object_creation : false
    });
    return updatedFlowState;
  };

  const onSelect = (flowState, result, displayFilter) => {
    let updatedFlowState = setSelectedValue(
      flowState,
      step,
      subStep,
      displayValue(result)
    );
    next(updatedFlowState, subStep, result);
  };

  const getType = (flowState, sub) => {
    const { steps } = flowState;
    if (subStep === 0) {
      return null;
    } else if (steps[step][sub]?.type) {
      return steps[step][sub].type;
    }
    return null;
  };

  const getSelectedSourceStream = (flowState, sub) => {
    const { steps } = flowState;
    if (subStep === 0) {
      return null;
    } else if (steps[step][sub]?.selectedSourceStream) {
      return steps[step][sub].selectedSourceStream;
    }
    return null;
  };

  const generateSelectedStreamsObject = (flowState) => {
    const obj = {};
    for (let j = 0; j < subStep; j++) {
      if (getType(flowState, j)) {
        obj[getType(flowState, j)] = getSelectedSourceStream(flowState, j);
      }
    }

    return obj;
  };

  const displayFilter = (result) => {
    return result.label ? result.label : result.name ? result.name : '';
  };

  const displayValue = (result) => {
    return result.name;
  };

  const renderComponent = (resultsFilter, onSelect, refreshData, setRefreshData) => {
    let config = {};
    if (step == 0) {
      config = sourceConfig;
    } else if (step == 1) {
      config = destinationConfig;
    }
    return (
      <CatalogSelectionComponent
        refreshData={refreshData}
        setRefreshData={setRefreshData}
        refreshKey={refreshKey}
        query={useLazyDiscoverConnectorQuery}
        queryArgs={{
          config: {
            ...config.connector_config,
            ...generateSelectedStreamsObject(flowState)
          },
          connectorType: config.connector_type,
          ...otherState
        }}
        resultFilter={resultsFilter}
        displayValue={displayValue}
        displayFilter={displayFilter}
        displayConnectorImage={false}
        subStep={subStep}
        step={step}
        onSelect={onSelect}
        updatedFlowStateAfterQuery={updatedFlowStateAfterQuery}
      />
    );
  };

  return {
    renderComponent: renderComponent,
    resultFilter: resultFilter,
    onSelect: onSelect
  };
}
