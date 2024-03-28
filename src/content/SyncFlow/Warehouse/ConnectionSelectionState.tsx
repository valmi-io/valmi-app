// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import CatalogSelectionComponent from '@content/SyncFlow/CatalogSelectionComponent';
import { setSelectedValue, setVarsinSubStep } from '@content/SyncFlow/stateManagement';

import { useLazyFetchCredentialsQuery } from '@store/api/apiSlice';

export function ConnectionSelectionState(refreshKey, dispatch, flowState, otherState, next, step, subStep) {
  const resultsFilter = (results) => {
    if (step === 0) {
      return results.filter((x) => x.connector_type.startsWith('SRC_'));
    } else {
      return results.filter((x) => x.connector_type.startsWith('DEST_'));
    }
  };

  const updatedFlowStateAfterQuery = (results) => {
    const updatedFlowState = setVarsinSubStep(flowState, step, subStep, {
      more: false,
      type: 'Connection'
    });
    return updatedFlowState;
  };

  const onSelect = (flowState, result, displayFilter) => {
    let updatedFlowState = setSelectedValue(flowState, step, subStep, displayValue(result));

    let config = {};
    if (step == 0) {
      config = { sourceConfig: result };
    } else if (step == 1) {
      config = { destinationConfig: result };
    }
    updatedFlowState = { ...updatedFlowState, ...config };
    next(updatedFlowState, subStep, result);
  };

  const displayFilter = (result) => {
    return result.name;
  };

  const displayValue = (result) => {
    return result.name;
  };

  const renderComponent = (resultsFilter, onSelect) => (
    <CatalogSelectionComponent
      refreshKey={refreshKey}
      query={useLazyFetchCredentialsQuery}
      queryArgs={{ workspaceId: otherState.workspaceId }}
      resultFilter={resultsFilter}
      displayFilter={displayFilter}
      displayValue={displayValue}
      subStep={subStep}
      step={step}
      displayConnectorImage={true}
      onSelect={onSelect}
      updatedFlowStateAfterQuery={updatedFlowStateAfterQuery}
    />
  );

  return {
    renderComponent: renderComponent,
    resultFilter: resultsFilter,
    onSelect: onSelect
  };
}
