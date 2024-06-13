/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:38:00 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { getConnectionMetrics, getRunStatus } from './SyncRunsUtils';
import { Stack, Typography } from '@mui/material';
import RunStatusIcon from './RunStatusIcon';
import { splitNumberByCommas } from '@/utils/lib';

interface SyncRunStatusProps {
  syncRun: any;
  displayError: any;
  isRetlFlow: boolean;
}

const SyncRunStatus = ({ syncRun, displayError, isRetlFlow }: SyncRunStatusProps) => {
  let runStatus = getRunStatus(syncRun);

  const handleStatusOnClick = () => {
    displayError(syncRun);
  };

  return (
    <Stack
      spacing={0.5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: (theme) => theme.spacing(1)
      }}
    >
      <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color:
              runStatus === 'failed'
                ? (theme) => theme.colors.error.main
                : runStatus === 'terminated'
                ? (theme) => theme.colors.error.main
                : runStatus === 'success'
                ? (theme) => theme.colors.success.main
                : (theme) => theme.colors.success.main
          }}
        >
          {runStatus.toUpperCase()}
        </Typography>

        {runStatus === 'failed' && (
          <RunStatusIcon onClick={handleStatusOnClick} status={runStatus} tooltipTitle={'Show Error'} />
        )}
      </Stack>

      {!isRetlFlow &&
        (getConnectionMetrics(syncRun, 'src').length > 0
          ? getConnectionMetrics(syncRun, 'src').map((metrics, index) => (
              <Stack key={`metrics-${index}`} direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontSize: 12 }} variant="body2">
                  {'TOTAL RECORDS LOADED: '}
                </Typography>
                <Typography sx={{ fontSize: 12 }} variant="body1">
                  {splitNumberByCommas(metrics.value)}
                </Typography>
              </Stack>
            ))
          : '-')}
    </Stack>
  );
};

export default SyncRunStatus;
