// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 7:52:12 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { MenuItem } from '@mui/material';

import {
  getCatalogLabel,
  getMyRefreshKey,
  getResults,
  getSelectedValue,
  setMyRefreshKey,
  setResults,
  setSelectedValue,
  ifAllowsObjectCreation
} from '@content/SyncFlow/stateManagement';

import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '@components/Error/ErrorUtils';
import { ErrorStatusText } from '@components/Error';
import SelectDropdown from '@components/SelectDropdown';
import { StackLayout } from '@components/Layouts/Layouts';
import ImageComponent, { ImageSize } from '@components/ImageComponent';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';

import { capitalizeFirstLetter } from '@utils/lib';
import CreateFieldContainer from '@/content/SyncFlow/Warehouse/CreateFieldContainer';

const CatalogSelectionComponent = (props) => {
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const {
    refreshKey,
    step,
    subStep,
    query,
    queryArgs,
    resultFilter,
    displayFilter,
    displayValue,
    displayConnectorImage,
    onSelect,
    updatedFlowStateAfterQuery,
    refreshData,
    setRefreshData
  } = props;

  const dispatch = useDispatch();

  const [fetchQuery, { data, isFetching, isError, error }] = query({});

  const [queryId, setQueryID] = useState(0);
  const [displayError, setDisplayError] = useState(null);

  useEffect(() => {
    setDisplayError(null);
  }, [flowState.currentStep]);

  useEffect(() => {
    if (getMyRefreshKey(flowState, step, subStep) !== refreshKey || refreshData) {
      setDisplayError(null);
      let updatedFlowState = setResults(flowState, [], step, subStep);
      updatedFlowState = setMyRefreshKey(
        updatedFlowState,
        step,
        subStep,
        refreshKey
      );
      updatedFlowState = setSelectedValue(updatedFlowState, step, subStep, '');

      dispatch(setFlowState(updatedFlowState));

      const newQueryId = queryId + 1;
      setQueryID(newQueryId);
      fetchQuery({ ...queryArgs, queryId: newQueryId });
    }
  }, [refreshKey, refreshData]);

  useEffect(() => {
    if (data && data.queryId === queryId) {
      if (hasErrorsInData(data.resultData)) {
        const traceError = getErrorsInData(data.resultData);
        setDisplayError(traceError);
      } else {
        let updatedFlowState = null;
        updatedFlowState = updatedFlowStateAfterQuery(data.resultData);
        updatedFlowState = setResults(
          updatedFlowState,
          resultFilter(data.resultData),
          step,
          subStep
        );

        dispatch(setFlowState(updatedFlowState));
        setRefreshData(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errors = getErrorsInErrorObject(error.errorData || error);
      const { message = '' } = errors || {};

      setDisplayError(message);
    }
  }, [isError]);

  return (
    <StackLayout>
      {displayError && <ErrorStatusText>{displayError}</ErrorStatusText>}
      {!displayError && (
        <SelectDropdown
          label={capitalizeFirstLetter(
            getCatalogLabel(flowState, step, subStep)
          )}
          hasError={displayError}
          value={getSelectedValue(flowState, step, subStep)}
          onChange={(event, key) => {
            onSelect(
              flowState,
              getResults(flowState, step, subStep)[
                parseInt(key.key.split('_valkey')[1])
              ]
            );
          }}
          hasIconComponent={true}
          isFetching={isFetching}
        >
          {getResults(flowState, step, subStep).map((option, index) => {
            return (
              <MenuItem key={'_valkey' + index} value={displayValue(option)}>
                {displayConnectorImage && (
                  <ImageComponent
                    src={`/connectors/${option.connector_type
                      .split('_')[1]
                      .toLowerCase()}.svg`}
                    alt="connection"
                    style={{ marginRight: 10 }}
                    size={ImageSize.small}
                  />
                )}
                {displayFilter(option)}
              </MenuItem>
            );
          })}
        </SelectDropdown>
      )}
      {ifAllowsObjectCreation(flowState, step, subStep) &&
            <CreateFieldContainer
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            onSelect={onSelect} getFlowState={flowState} step={step} subStep={subStep}/>
      }
    </StackLayout>
  );
};

export default CatalogSelectionComponent;
