/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { Box, MenuItem, Stack, styled } from '@mui/material';
import MoveDownIcon from '@mui/icons-material/MoveDown';

import {
  getDestinationModes,
  getSelectedDestinationMode,
  getSelectedSourceMode,
  getSourceModes,
  saveDestinationMode,
  saveSelectedSourceMode,
  showCustomMappings,
  showTemplatedMappings
} from './mappingManagement';
import { setFlowState } from '../../../store/reducers/syncFlow';
import IdMapping from './IdMapping';
import FieldMappingContainer from './FieldMappingContainer';
import SelectDropdown from '../../../components/SelectDropdown';
import { StackLayout } from '@/components/Layouts/Layouts';
import { ErrorStatusText } from '../../../components/Error';
import TemplatedFieldsContainer from './TemplatedMapping';
import MappingCard from './MappingCard';
import ConnectionCard from '../../Syncs/SyncDetails/ConnectionCard';
import appIcons from '../../../utils/icon-utils';

const BoxLayout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2
}));

const Mapping = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  let {
    isEditableFlow = false,
    sourceCatalog,
    destinationCatalog,
    extra = null
  } = flowState;

  const {
    source: {
      credential: { connector_type: sourceConnectionType = '' } = {}
    } = {},
    destination: {
      credential: { connector_type: destinationConnectionType = '' } = {}
    } = {}
  } = extra || {};

  const { label: sourceTableName = '' } = sourceCatalog || {};

  const { label: destinationObjectName = '' } = destinationCatalog || {};

  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  return (
    <StackLayout spacing={2}>
      {/** Source -  Destination */}
      {isEditableFlow && (
        <Stack
          display="flex"
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack display="flex" direction="row" alignItems="center" spacing={3}>
            <ConnectionCard
              connectionType={sourceConnectionType}
              connectionTitle={sourceTableName}
            />

            {/* right arrow icon */}
            {appIcons.ARROW_RIGHT}

            <ConnectionCard
              connectionType={destinationConnectionType}
              connectionTitle={destinationObjectName}
            />
          </Stack>
          {/** Schedule */}
        </Stack>
      )}
      <MappingCard
        icon={<MoveDownIcon sx={{ mr: 1 }} />}
        label="Select a Sync Mode"
      >
        {/** Source supported sync modes */}
        <BoxLayout>
          <SelectDropdown
            label={'Warehouse sync mode'}
            value={getSelectedSourceMode(flowState)}
            disabled={isEditableFlow}
            onChange={(event, key) => {
              saveToStore(
                saveSelectedSourceMode(flowState, event.target.value)
              );
            }}
          >
            {getSourceModes(sourceCatalog).map((option: any, index: any) => {
              return (
                <MenuItem key={'_valkey' + index} value={option}>
                  {option}
                </MenuItem>
              );
            })}
          </SelectDropdown>
        </BoxLayout>

        {/** Destination supported sync modes */}
        <BoxLayout sx={{ marginTop: (theme) => theme.spacing(1) }}>
          <SelectDropdown
            disabled={getSelectedSourceMode(flowState) === '' || isEditableFlow}
            label={'Destination sync mode'}
            value={getSelectedDestinationMode(flowState)}
            onChange={(event, key) => {
              saveToStore(saveDestinationMode(flowState, event.target.value));
            }}
          >
            {getDestinationModes(flowState, destinationCatalog).map(
              (option: any, index: any) => {
                return (
                  <MenuItem key={'_valkey' + index} value={option}>
                    {option}
                  </MenuItem>
                );
              }
            )}
          </SelectDropdown>
          {getSelectedSourceMode(flowState) !== '' &&
            getDestinationModes(flowState, destinationCatalog).length < 1 && (
              <ErrorStatusText>
                {'Incompatible supported modes'}
              </ErrorStatusText>
            )}
        </BoxLayout>
      </MappingCard>

      {/** Id Mapping */}
      <BoxLayout>
        <IdMapping />
      </BoxLayout>

      {/** Display Custom field mapping when selected destination sync mode has allow_freeform_fields = true */}
      {/* {getSelectedDestinationMode(flowState) !== '' &&
        showCustomMappings(flowState, destinationCatalog) && (
          <BoxLayout>
            <FieldMappingContainer />
          </BoxLayout>
        )} */}

      {showCustomMappings(flowState, destinationCatalog) && (
        <BoxLayout>
          <FieldMappingContainer />
        </BoxLayout>
      )}

      {/** Display Templated field mapping when selected destination sync mode has templated_fields  */}
      {getSelectedDestinationMode(flowState) !== '' &&
        showTemplatedMappings(
          flowState,
          getSelectedDestinationMode(flowState)
        ) && (
          <BoxLayout>
            <TemplatedFieldsContainer />
          </BoxLayout>
        )}
    </StackLayout>
  );
};

export default Mapping;
