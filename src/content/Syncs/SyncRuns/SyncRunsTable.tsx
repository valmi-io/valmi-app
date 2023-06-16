// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 5:38:11 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  Box,
  Chip,
  Icon,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled
} from '@mui/material';

import {
  TABLE_COLUMN_SIZES,
  TableColumnProps
} from '../../../utils/table-utils';
import {
  getConnectionMetrics,
  getConnectionStatus,
  getErrorInSyncRun,
  getIcon,
  getRunStatus
} from './SyncRunsUtils';
import { useState } from 'react';
import AlertComponent from '../../../components/Alert';
import {
  capitalizeFirstLetter,
  convertUTCDateToLocalDate,
  getTimeDifference,
  splitNumberByCommas
} from '../../../utils/lib';
import appIcons, { AppIconARROW_RIGHT } from '../../../utils/icon-utils';

type SyncRunsTableProps = {
  syncRunsData: any;
};

const syncRunColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Warehouse',
    minWidth: TABLE_COLUMN_SIZES[4],
    icon: appIcons.SRC
  },
  { id: '2', label: '', minWidth: TABLE_COLUMN_SIZES[1] },
  {
    id: '3',
    label: 'Destination',
    minWidth: TABLE_COLUMN_SIZES[4],
    icon: appIcons.DEST
  },
  {
    id: '4',
    label: 'Started_at',
    minWidth: TABLE_COLUMN_SIZES[3],
    icon: appIcons.STARTED_AT
  },
  {
    id: '5',
    label: 'Status',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.STATUS
  }
];

const ChipComponent = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const MetricChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'lightgray'
}));

const SyncRunsTable = ({ syncRunsData }: SyncRunsTableProps) => {
  const [errorDialog, showErrorDialog] = useState(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState('');

  {
    /** Sync Run Table Columns */
  }
  const generateColumns = (columns: TableColumnProps[]) => {
    return columns.map((column) => {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          style={{
            minWidth: column.minWidth
          }}
        >
          <Stack direction="row" alignItems="center">
            {column.icon && (
              <Icon sx={{ marginRight: (theme) => theme.spacing(1) }}>
                {column.icon}
              </Icon>
            )}
            {column.label}
          </Stack>
        </TableCell>
      );
    });
  };

  const getStatusIconComponent = (status, tooltipTitle, onClick) => {
    return (
      <>
        <Tooltip title={tooltipTitle}>
          <IconButton
            color={status === 'failed' ? 'error' : 'primary'}
            onClick={onClick}
          >
            {getIcon(status)}
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const displayConnectionMetrics = (syncRun, connection) => {
    // check the connection status
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

    return (
      <Stack spacing={0.5}>
        <Stack spacing={0.5} direction="row" alignItems="center">
          <Typography variant="body2">
            {capitalizeFirstLetter(connectionStatus)}
          </Typography>

          {connectionStatus === 'failed' &&
            getStatusIconComponent(connectionStatus, '', () => {})}

          {connectionStatus === 'success' &&
            getStatusIconComponent(connectionStatus, '', () => {})}
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
          {getConnectionMetrics(syncRun, connection).length > 0
            ? getConnectionMetrics(syncRun, connection).map(
                (metrics, index) => (
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
                )
              )
            : '-'}
        </Stack>
      </Stack>
    );
  };

  {
    /** Sync Run Status */
  }
  const displayRunStatus = (syncRun) => {
    let status = getRunStatus(syncRun);

    return (
      <Stack spacing={0.5} direction="row" alignItems="center">
        <ChipComponent
          label={status}
          color={
            status === 'failed'
              ? 'error'
              : status === 'success'
              ? 'primary'
              : 'secondary'
          }
        />

        {status === 'failed' &&
          getStatusIconComponent(status, 'Show Error', () =>
            displayError(syncRun)
          )}
      </Stack>
    );
  };

  {
    /** Sync Started_at */
  }
  const displayRunStartedAt = (syncRun) => {
    const runStartedAt = convertUTCDateToLocalDate(new Date(syncRun.run_at));

    const runStartedAtDisplay =
      runStartedAt.toDateString() +
      ' ' +
      runStartedAt.getHours().toString().padStart(2, '0') +
      ':' +
      runStartedAt.getMinutes().toString().padStart(2, '0');

    return <>{runStartedAtDisplay}</>;
  };

  {
    /** Sync run time */
  }
  const displayRunTime = (syncRun) => {
    const runStartedAt = convertUTCDateToLocalDate(new Date(syncRun.run_at));
    // TODO: replace runEndAt with syncRun.run_end
    const runEndAt = new Date();

    const runTime = getTimeDifference(runStartedAt, runEndAt);
    return `Took ${runTime}`;
  };

  {
    /** Sync Run Error */
  }
  const displayError = (syncRun) => {
    const syncErrorMessage = getErrorInSyncRun(syncRun);
    setSyncErrorMessage(syncErrorMessage);
    showErrorDialog(true);
  };

  const handleClose = () => {
    showErrorDialog(false);
  };

  return (
    <>
      <AlertComponent
        open={errorDialog}
        onClose={handleClose}
        message={syncErrorMessage}
        isError={true}
      />
      {/* Syncs Table*/}
      <TableContainer>
        <Table>
          {/* Syncs Table Columns */}
          <TableHead>
            <TableRow>{generateColumns(syncRunColumns)}</TableRow>
          </TableHead>
          {/* Syncs Table Body */}
          <TableBody>
            {syncRunsData &&
              syncRunsData.length > 0 &&
              syncRunsData.map((syncRun, index) => {
                return (
                  <TableRow hover key={`run_key ${index}`}>
                    <TableCell>
                      {displayConnectionMetrics(syncRun, 'src')}
                    </TableCell>
                    <TableCell>
                      <AppIconARROW_RIGHT />
                    </TableCell>
                    <TableCell>
                      {displayConnectionMetrics(syncRun, 'dest')}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5} display="flex">
                        <Box>{displayRunStartedAt(syncRun)}</Box>
                        <Box>{displayRunTime(syncRun)}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{displayRunStatus(syncRun)}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SyncRunsTable;
