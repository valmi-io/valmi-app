/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Divider, styled } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import {
  addNewItemToMap,
  deleteItemFromMap,
  enableCustomMappingItem,
  getMapping,
  updateItemInMap
} from '@content/SyncFlow/Mapping/mappingManagement';
import FieldMapping from '@content/SyncFlow/Mapping/FieldMapping';
import MappingCard from '@content/SyncFlow/Mapping/MappingCard';

import PopoverComponent from '@components/Popover';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';

const MappingButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

const FieldMappingContainer = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  let { sourceCatalog, destinationCatalog } = flowState;

  // Popover states
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const displayPopoverItem = (title: string, itemType: any) => {
    // TODO: Disable Dropdown itemType,
    // if selected destination sync mode does not have properties
    // or if all the properties are already mapped.

    return (
      <Box
        sx={{
          display: 'flex',
          padding: 1,
          alignItems: 'flex-start'
        }}
      >
        <Button
          disabled={!enableCustomMappingItem(flowState, itemType)}
          color="primary"
          sx={{ backgroundColor: 'transparent' }}
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => {
            saveToStore(addNewItemToMap(flowState, itemType));
            handleClose();
          }}
        >
          {title}
        </Button>
      </Box>
    );
  };

  return (
    <MappingCard
      label="Setup Destination Field Mappings"
      icon={<PostAddIcon sx={{ mr: 1 }} />}
    >
      {/* Display Popover when clicked on the Add mapping button  */}
      {Boolean(anchorEl) && (
        <PopoverComponent anchorEl={anchorEl} handleClose={handleClose}>
          {displayPopoverItem('Predefined field', 'dropdown')}
          <Divider />
          {displayPopoverItem('Custom field', 'free')}
        </PopoverComponent>
      )}

      {/* Field mapping */}
      <FieldMapping
        flowState={flowState}
        mapping={getMapping(flowState)}
        sourceCatalog={sourceCatalog}
        destinationCatalog={destinationCatalog}
        mappingUpdated={(index: any, mapObj: any) => {
          saveToStore(updateItemInMap(flowState, index, mapObj));
        }}
        mappingDeleted={(index: any) => {
          saveToStore(deleteItemFromMap(flowState, index));
        }}
      />

      {/** Add mapping button*/}
      <MappingButton variant="contained" onClick={handleClickOpen}>
        + Add Mapping
      </MappingButton>
    </MappingCard>
  );
};

export default FieldMappingContainer;
