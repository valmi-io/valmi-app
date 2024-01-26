/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:45:06 pm
 * Author: Nagendra S @ valmi.io
 */

import { useDispatch, useSelector } from 'react-redux';

import { Box, MenuItem, Stack, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyIcon from '@mui/icons-material/Key';

import {
  getDestinationFields,
  getDestinationIdKey,
  getSelectedDestinationMode,
  getSelectedSourceMode,
  getSourceFields,
  getSourceIdKey,
  isDestinationIdMappingRequired,
  saveDestinationIdKey,
  saveSourceIdKey
} from '@content/SyncFlow/Mapping/mappingManagement';
import MappingCard from '@content/SyncFlow/Mapping/MappingCard';

import SelectDropdown from '@components/SelectDropdown';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';

const BoxLayout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  width: '100%'
}));

const StackLayout = styled(Stack)(({ theme }) => ({
  ...theme.typography.body2
}));

const IdMapping = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  let { isEditableFlow = false, sourceCatalog, destinationCatalog } = flowState;

  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  const enableDropdown = () => {
    if (
      getSelectedSourceMode(flowState) !== '' &&
      getSelectedDestinationMode(flowState) !== '' &&
      !isEditableFlow
    )
      return true;
    return false;
  };

  return (
    <MappingCard label="Select an ID Key" icon={<KeyIcon sx={{ mr: 1 }} />}>
      <StackLayout direction="row" alignItems="center" justifyContent="center">
        <BoxLayout>
          <SelectDropdown
            label={'Warehouse Id key'}
            disabled={!enableDropdown()}
            value={getSourceIdKey(flowState)}
            onChange={(event, key) => {
              saveToStore(
                saveSourceIdKey(
                  flowState,
                  destinationCatalog,
                  event.target.value
                )
              );
            }}
          >
            {getSourceFields(sourceCatalog).map((key, index) => (
              <MenuItem key={'_valkey' + index} value={key}>
                {key}
              </MenuItem>
            ))}
          </SelectDropdown>
        </BoxLayout>

        {/*Checking If destination Id mapping is required*/}
        {isDestinationIdMappingRequired(flowState, destinationCatalog) && (
          <>
            {/* <CompareArrowsIcon /> */}
            <ArrowForwardIcon
              style={{ fontSize: 18, marginLeft: 2, marginRight: 2 }}
            />
            <BoxLayout>
              <SelectDropdown
                label={'Destination Id Key'}
                value={getDestinationIdKey(flowState)}
                onChange={(event, key) => {
                  saveToStore(
                    saveDestinationIdKey(flowState, event.target.value)
                  );
                }}
              >
                {getDestinationFields(flowState, destinationCatalog).map(
                  (key, index) => (
                    <MenuItem key={'_valkey' + index} value={key}>
                      {key}
                    </MenuItem>
                  )
                )}
              </SelectDropdown>
            </BoxLayout>
          </>
        )}
      </StackLayout>
    </MappingCard>
  );
};

export default IdMapping;
