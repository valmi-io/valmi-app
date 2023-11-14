/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:15:05 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Chip, Stack, Typography, styled } from '@mui/material';

import { getConnectionMetrics, getConnectionStatus } from './SyncRunsUtils';

import { capitalizeFirstLetter, splitNumberByCommas } from '@utils/lib';

import RunStatusIcon from './RunStatusIcon';

const MetricChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'lightgray'
}));

interface ConnectionMetricsProps {
  syncRun: any;
  connection: any;
  displayError: any;
}

const ConnectionMetrics = ({
  syncRun,
  connection,
  displayError
}: ConnectionMetricsProps) => {
  let connectionStatus = getConnectionStatus(syncRun, connection);

  if (connectionStatus === 'scheduled' || connectionStatus === 'running') {
    if (connection === 'dest') {
      connectionStatus = 'Delivering...';
    } else {
      connectionStatus =
        connectionStatus === 'scheduled'
          ? 'Preparing Data...'
          : 'Extracting Data...';
    }
  }

  const handleStatusOnClick = () => {
    displayError(syncRun, connection);
  };

  return (
    <Stack spacing={1}>
      {/** Connection status stack */}
      <Stack spacing={0.5} direction="row" alignItems="center">
        {/** Display connnection status */}
        <Typography variant="body2">
          {capitalizeFirstLetter(connectionStatus)}
        </Typography>

        {/** Display error icon if connection status is failed */}
        {connectionStatus === 'failed' && (
          <RunStatusIcon
            status={connectionStatus}
            tooltipTitle={''}
            onClick={handleStatusOnClick}
          />
        )}

        {/** Display success icon if connection status is success */}
        {connectionStatus === 'success' && (
          <RunStatusIcon
            status={connectionStatus}
            tooltipTitle={''}
            onClick={() => {}}
          />
        )}
        {/** Display Log button */}
        {/* <Button
                  sx={{ mt: { xs: 2, md: 0 }, fontWeight: 500, fontSize: 12 }}
                  startIcon={<LogoutOutlinedIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => navigateToSyncRunLogs(syncRun, connection)}
                >
                  Logs
                </Button> */}
      </Stack>

      {/** Connection metrics stack */}
      <Stack spacing={1} direction="row" alignItems="center">
        {getConnectionMetrics(syncRun, connection).length > 0
          ? getConnectionMetrics(syncRun, connection).map((metrics, index) => (
              <Stack
                key={`metrics-${index}`}
                direction="row"
                spacing={0.5}
                alignItems="center"
              >
                <MetricChip
                  size="small"
                  label={`${capitalizeFirstLetter(metrics.key)}
                      `}
                />
                <Typography sx={{ fontSize: 12 }}>
                  {splitNumberByCommas(metrics.value)}
                </Typography>
              </Stack>
            ))
          : '-'}
      </Stack>
    </Stack>
  );
};

export default ConnectionMetrics;
