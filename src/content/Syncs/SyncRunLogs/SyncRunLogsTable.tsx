/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, August 21st 2023, 11:33:57 am
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableRowProps,
  Typography,
  styled
} from '@mui/material';

import {
  SyncRunLogsTableProps,
  getMessageTimestamp,
  syncRunLogColumns
} from '@content/Syncs/SyncRunLogs/SyncRunLogsUtils';

import { TABLE_COLUMN_SIZES } from '@utils/table-utils';
import TableHeader from '@components/Table/TableHeader';
import EventsFooter from '@/content/Events/LiveEvents/EventsFooter';

export const CustomizedTableRow = styled(TableRow)<TableRowProps>(({}) => ({
  '& > *': {
    padding: '6px 12px',
    lineHeight: '1'
  },

  '&.MuiTableRow-hover:hover': {
    cursor: 'pointer'
  }
}));

export const LogMessage = styled(Typography)(({}) => ({
  maxWidth: TABLE_COLUMN_SIZES[10],
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const SyncRunLogsTable = ({ data, onRowClick }: SyncRunLogsTableProps) => {
  const getTimestamp = (log: any) => {
    return log[0];
  };

  const getMessage = (log: any) => {
    return log[1];
  };

  return (
    <>
      <TableContainer>
        <Table>
          {/* Logs Table Columns */}
          <TableHead>
            <TableHeader columns={syncRunLogColumns} />
          </TableHead>
          {/* Logs Table Body */}
          <TableBody>
            {data.ids.map((id: any) => {
              const item = data.entities[id];

              return item.logs?.map((log: any, index: string) => {
                return (
                  <CustomizedTableRow key={`log_key ${index}`} onClick={() => onRowClick({ data: log })} hover>
                    <TableCell>
                      <Typography variant="subtitle1">{getMessageTimestamp(getTimestamp(log))}</Typography>
                    </TableCell>

                    <TableCell>
                      <LogMessage variant="subtitle1">{getMessage(log)}</LogMessage>
                    </TableCell>
                  </CustomizedTableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default memo(SyncRunLogsTable);
