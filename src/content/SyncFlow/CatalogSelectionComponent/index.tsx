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
  ifAllowsObjectCreation,
  generateCreateConfigObject
} from '@content/SyncFlow/stateManagement';

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@components/Error/ErrorUtils';
import { ErrorStatusText } from '@components/Error';
import SelectDropdown from '@components/SelectDropdown';
import { StackLayout } from '@components/Layouts/Layouts';
import ImageComponent, { ImageSize } from '@components/ImageComponent';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';

import { capitalizeFirstLetter } from '@utils/lib';
import CreateFieldContainer from '@/content/SyncFlow/Warehouse/CreateFieldContainer';
import { FormStatus } from '@/utils/form-utils';
import { queryHandler } from '@/services';
import { useLazyCreateConnectorQuery } from '@/store/api/apiSlice';

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
    updatedFlowStateAfterQuery
  } = props;

  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const [fetchQuery, { data, isFetching, isError, error }] = query({});

  // create object query
  const [createObject] = useLazyCreateConnectorQuery();

  const [queryId, setQueryID] = useState(0);
  const [displayError, setDisplayError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // create form state
  const [formState, setFormState] = useState<{
    status: FormStatus;
    value: string;
    error: string;
    show: boolean;
    refresh: boolean;
  }>({
    status: 'empty',
    value: '',
    error: '',
    show: false,
    refresh: false
  });

  useEffect(() => {
    setDisplayError(null);
  }, [flowState.currentStep]);

  useEffect(() => {
    if (getMyRefreshKey(flowState, step, subStep) !== refreshKey) {
      setDisplayError(null);
      // discover objects
      handleDiscover();
    }
  }, [refreshKey]);

  useEffect(() => {
    if (data && data.queryId === queryId) {
      if (hasErrorsInData(data.resultData)) {
        const traceError = getErrorsInData(data.resultData);
        setDisplayError(traceError);
      } else {
        let updatedFlowState = null;
        updatedFlowState = updatedFlowStateAfterQuery(data.resultData);
        updatedFlowState = setResults(updatedFlowState, resultFilter(data.resultData), step, subStep);

        dispatch(setFlowState(updatedFlowState));
        if (formState.status === 'success') {
          setFormState((state) => ({
            ...state,
            refresh: true
          }));
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (formState.refresh) {
      let currResults = getResults(flowState, step, subStep);
      onSelect(flowState, currResults[0]);

      setFormState((state) => ({
        ...state,
        status: 'empty',
        refresh: false
      }));
    }
  }, [formState.refresh]);

  useEffect(() => {
    if (isError) {
      const errors = getErrorsInErrorObject(error.errorData || error);
      const { message = '' } = errors || {};

      setDisplayError(message);
    }
  }, [isError]);

  // discover function - query

  const handleDiscover = () => {
    let updatedFlowState = setResults(flowState, [], step, subStep);
    updatedFlowState = setMyRefreshKey(updatedFlowState, step, subStep, refreshKey);
    updatedFlowState = setSelectedValue(updatedFlowState, step, subStep, '');

    dispatch(setFlowState(updatedFlowState));

    const newQueryId = queryId + 1;
    setQueryID(newQueryId);
    fetchQuery({ ...queryArgs, queryId: newQueryId });
  };

  const handleOnChange = (event: any) => {
    setFormState((state) => ({
      ...state,
      value: event.target.value
    }));
  };

  const onSubmit = () => {
    const payload = generateCreateConfigObject(flowState, formState.value, appState);

    setFormState((state) => ({
      ...state,
      status: 'submitting'
    }));

    handleOnCreate(payload);
  };

  const handleOnCreate = async (payload: any) => {
    await queryHandler({ query: createObject, payload: payload, successCb, errorCb });
  };

  const successCb = (data: any) => {
    const result = data?.resultData?.create_response;
    const hasError = result?.status;

    if (!hasError) {
      setFormState((state) => ({
        ...state,
        status: 'success',
        value: '',
        error: '',
        show: false
      }));
      handleDiscover();
    } else {
      const errorMsg = result?.message ?? 'UNKNOWN ERROR';

      setFormState((state) => ({
        ...state,
        status: 'error',
        error: errorMsg
      }));
    }
  };

  const errorCb = (error: any) => {
    setFormState((state) => ({
      ...state,
      status: 'error',
      error: error
    }));
  };

  const handleCreateOnClick = () => {
    setFormState((state) => ({
      ...state,
      show: !state.show
    }));
  };

  return (
    <StackLayout>
      {displayError && <ErrorStatusText>{displayError}</ErrorStatusText>}
      {!displayError && (
        <SelectDropdown
          label={capitalizeFirstLetter(getCatalogLabel(flowState, step, subStep))}
          hasError={displayError}
          value={getSelectedValue(flowState, step, subStep)}
          onChange={(event, key) => {
            onSelect(flowState, getResults(flowState, step, subStep)[parseInt(key.key.split('_valkey')[1])]);
          }}
          hasIconComponent={true}
          isFetching={isFetching}
          allowCreateButton={ifAllowsObjectCreation(flowState, step, subStep)}
          handleCreateClick={handleCreateOnClick}
          isCreating={formState.show}
        >
          {getResults(flowState, step, subStep).map((option, index) => {
            return (
              <MenuItem key={'_valkey' + index} value={displayValue(option)}>
                {displayConnectorImage && (
                  <ImageComponent
                    src={`/connectors/${option.connector_type.split('_')[1].toLowerCase()}.svg`}
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
      {formState.show && (
        <CreateFieldContainer onSubmit={onSubmit} formState={formState} handleOnChange={handleOnChange} />
      )}
    </StackLayout>
  );
};

export default CatalogSelectionComponent;
