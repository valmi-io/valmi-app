// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useDispatch, useSelector } from 'react-redux';

import {
  changeStepsArray,
  syncFlowStateMap
} from '@content/SyncFlow/stateManagement';
import { getMappingStates } from '@content/SyncFlow/Mapping/mappingManagement';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';
import { useState } from 'react';

const Warehouse = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);
  const otherState = useSelector((state: RootState) => state.appFlow.appState);
  const [refreshData, setRefreshData] = useState(false);
  let { steps = [], currentStep = 0 } = flowState;

  const moreAvailable = (flowState, lastStep) => {
    if (
      lastStep >= 0 &&
      flowState.steps[currentStep][lastStep].hasOwnProperty('more')
    )
      return flowState.steps[currentStep][lastStep].more;
    return true;
  };

  const next = (updatedFlowState, currentSubStepNum, result) => {
    if (currentSubStepNum === 0) {
      const stepsCopy = updatedFlowState.steps[currentStep].slice(
        0,
        currentSubStepNum + 1
      );

      const randomkey = 'key_' + Math.random();

      stepsCopy.push({
        refreshKey: randomkey,
        state: 'discoverState',
        stepNum: 1
      });

      const steps = changeStepsArray(
        updatedFlowState.steps,
        currentStep,
        stepsCopy,
        true
      );

      let credentialId =
        currentStep === 0
          ? { sourceCredentialId: result }
          : { destinationCredentialId: result };

      dispatch(
        setFlowState({
          ...updatedFlowState,
          ...credentialId,
          steps: steps
        })
      );
    } else {
      let stepsCopy = updatedFlowState.steps[currentStep];
      let newSteps = null;
      //Add a new step if there are more
      if (moreAvailable(flowState, currentSubStepNum)) {
        stepsCopy = stepsCopy.slice(0, currentSubStepNum + 1);
        const randomkey = 'key_' + Math.random();

        stepsCopy.push({
          refreshKey: randomkey,
          state: 'discoverState',
          stepNum: stepsCopy.length
        });

        newSteps = changeStepsArray(
          updatedFlowState.steps,
          currentStep,
          stepsCopy,
          true
        );
      } else {
        let nextSectionSteps;
        if (currentStep === 0) {
          updatedFlowState = { ...updatedFlowState, sourceCatalog: result };
          nextSectionSteps = [
            [
              {
                refreshKey: 'key_' + Math.random(),
                state: 'connectionSelectionState',
                stepNum: 0
              }
            ]
          ];
        } else if (currentStep === 1) {
          updatedFlowState = {
            ...updatedFlowState,
            destinationCatalog: result
          };

          nextSectionSteps = [getMappingStates()];
        }
        //Otherwise move to next section

        newSteps = changeStepsArray(
          updatedFlowState.steps,
          currentStep,
          stepsCopy,
          false
        );
        newSteps = [...newSteps, ...nextSectionSteps];
      }

      dispatch(
        setFlowState({
          ...updatedFlowState,
          steps: newSteps
        })
      );
    }
  };

  return steps[currentStep].map((step, index) => {
    const warehouseStep = syncFlowStateMap[step['state']](
      step['refreshKey'],
      dispatch,
      flowState,
      otherState,
      next,
      currentStep,
      step['stepNum']
    );

    return (
      <div key={'key_' + index} style={{ width: '100%' }}>
        {warehouseStep.renderComponent(
          warehouseStep.resultFilter,
          warehouseStep.onSelect,
          refreshData,
          setRefreshData
        )}
      </div>
    );
  });
};

export default Warehouse;
