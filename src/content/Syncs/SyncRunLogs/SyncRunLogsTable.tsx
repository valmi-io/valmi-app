/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, August 21st 2023, 11:33:57 am
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import {
  Chip,
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
  processLogsArr,
  syncRunLogColumns
} from '@content/Syncs/SyncRunLogs/SyncRunLogsUtils';

import { TABLE_COLUMN_SIZES } from '@utils/table-utils';
import TableHeader from '@components/Table/TableHeader';
// import { StyledChip } from '@/content/Events/LiveEvents/IncomingEventsTable';

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

const StyledChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#B497FF'
}));

const SyncRunLogsTable = ({ data, onRowClick }: SyncRunLogsTableProps) => {
  const getTimestamp = (log: any) => {
    return log['timestamp'];
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

              const proccessedLogs: any[] = processLogsArr(item.logs);

              return proccessedLogs.map((item, index) => {
                const { type = '', log: { message = '' } = {} } = item?.event ?? {};

                return (
                  <CustomizedTableRow key={`log_key ${index}`} onClick={() => onRowClick({ data: item })} hover>
                    <TableCell>
                      <Typography variant="subtitle1">{getMessageTimestamp(getTimestamp(item))}</Typography>
                    </TableCell>

                    <TableCell>
                      <StyledChip
                        size="small"
                        label={type}
                        sx={{ backgroundColor: (theme) => theme.colors.secondary.main }}
                      />
                    </TableCell>
                    <TableCell>
                      <LogMessage variant="subtitle1">{message}</LogMessage>
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
