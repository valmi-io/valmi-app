/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:02:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Stack, TableCell, TableRow } from '@mui/material';

import { AppIconARROW_RIGHT } from '@utils/icon-utils';
import ConnectionMetrics from './ConnectionMetrics';
import SyncRunTimeStamp from './SyncRunTimeStamp';
import SyncRunStatus from './SyncRunStatus';

interface SyncRunTableRowProps {
  syncRun: any;
  displayError: any;
  onLogClick: (syncRun: any, connection: any) => void;
}

/**
 * Responsible for rendering `sync run`.
 *
 * - Responsible for the styling of the sync run.
 *
 */

const SyncRunTableRow = ({
  syncRun,
  displayError,
  onLogClick
}: SyncRunTableRowProps) => {
  return (
    <TableRow hover>
      <TableCell>
        <ConnectionMetrics
          connection={'src'}
          displayError={displayError}
          syncRun={syncRun}
          onLogClick={onLogClick}
        />
      </TableCell>

      <TableCell>
        <AppIconARROW_RIGHT />
      </TableCell>
      <TableCell>
        <ConnectionMetrics
          connection={'dest'}
          displayError={displayError}
          syncRun={syncRun}
          onLogClick={onLogClick}
        />
      </TableCell>
      <TableCell>
        <Stack spacing={0.5} display="flex">
          <SyncRunTimeStamp syncRun={syncRun} />
        </Stack>
      </TableCell>
      <TableCell>
        <SyncRunStatus syncRun={syncRun} displayError={displayError} />
      </TableCell>
    </TableRow>
  );
};

export default SyncRunTableRow;
