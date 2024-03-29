/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:30:32 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { convertUTCDateToLocalDate, getFormattedUTC, getTimeDifference } from '@utils/lib';
import { isSyncRunning } from './SyncRunsUtils';
import { Box } from '@mui/material';

interface SyncRunTimeStampProps {
  syncRun: any;
}
const SyncRunTimeStamp = ({ syncRun }: SyncRunTimeStampProps) => {
  const runStartedAt = convertUTCDateToLocalDate(new Date(syncRun.run_at));

  const runStartedAtDisplay = getFormattedUTC(syncRun.run_at);

  let runEndAt = null;

  if (syncRun.run_end_at) {
    runEndAt = convertUTCDateToLocalDate(new Date(syncRun.run_end_at));
  } else if (isSyncRunning(syncRun)) {
    runEndAt = new Date();
  } else return null;

  const runTime = getTimeDifference(runStartedAt, runEndAt);

  return (
    <>
      <Box>{runStartedAtDisplay}</Box>
      <Box>{`Took ${runTime}`}</Box>
    </>
  );
};

export default SyncRunTimeStamp;
