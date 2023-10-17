/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useDispatch, useSelector } from 'react-redux';

import { Box, InputLabel, MenuItem, styled } from '@mui/material';

import {
  displaySchedule,
  getSchedule,
  getScheduleOptions,
  getSyncName,
  saveSchedule,
  saveSyncName
} from '@content/SyncFlow/Schedule/scheduleManagement';

import { StackLayout } from '@components/Layouts/Layouts';
import SelectDropdown from '@components/SelectDropdown';
import FormFieldText from '@components/FormInput/FormFieldText';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';

const BoxLayout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  width: '100%'
}));

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body2
}));

const Schedule = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  return (
    <StackLayout spacing={2}>
      <BoxLayout>
        <Label>Sync name</Label>
        <FormFieldText
          field={{}}
          description={'Enter a name to help you identify this sync'}
          label={''}
          fullWidth={true}
          type="text"
          required={true}
          error={false}
          value={getSyncName(flowState)}
          onChange={(event: any) => {
            saveToStore(saveSyncName(flowState, event.target.value));
          }}
        />
      </BoxLayout>
      <BoxLayout>
        <SelectDropdown
          label={'Schedule'}
          value={displaySchedule(getSchedule(flowState))}
          onChange={(event, key) => {
            saveToStore(
              saveSchedule(
                flowState,
                getScheduleOptions()[parseInt(key.key.split('_valkey')[1])]
              )
            );
          }}
        >
          {getScheduleOptions().map((option, index) => {
            return (
              <MenuItem key={'_valkey' + index} value={displaySchedule(option)}>
                {displaySchedule(option)}
              </MenuItem>
            );
          })}
        </SelectDropdown>
      </BoxLayout>
    </StackLayout>
  );
};

export default Schedule;
