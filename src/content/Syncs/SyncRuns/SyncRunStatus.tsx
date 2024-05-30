/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:38:00 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { getRunStatus } from './SyncRunsUtils';
import { Chip, Stack, styled } from '@mui/material';
import RunStatusIcon from './RunStatusIcon';

interface SyncRunStatusProps {
  syncRun: any;
  displayError: any;
}

const ChipComponent = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const SyncRunStatus = ({ syncRun, displayError }: SyncRunStatusProps) => {
  let runStatus = getRunStatus(syncRun);

  const handleStatusOnClick = () => {
    displayError(syncRun);
  };

  return (
    <Stack spacing={0.5} direction="row" alignItems="center">
      <ChipComponent
        label={runStatus}
        color={runStatus === 'failed' ? 'error' : runStatus === 'success' ? 'success' : 'secondary'}
      />

      {runStatus === 'failed' && (
        <RunStatusIcon onClick={handleStatusOnClick} status={runStatus} tooltipTitle={'Show Error'} />
      )}
    </Stack>
  );
};

export default SyncRunStatus;
