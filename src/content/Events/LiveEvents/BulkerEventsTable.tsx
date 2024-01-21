/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 1:30:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import TableHeader from '@components/Table/TableHeader';
import { TData } from '@utils/typings.d';

import { TABLE_COLUMN_SIZES, TableColumnProps } from '@/utils/table-utils';
import appIcons from '@/utils/icon-utils';
import { CustomizedTableRow, LogMessage } from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import { Chip, TableCell, Typography, styled } from '@mui/material';
import { getFormattedUTC } from '@/utils/lib';
import EventsFooter from '@/content/Events/LiveEvents/EventsFooter';

interface IBulkerEventsTableProps {
  data: TData;
  onRowClick: ({ data }: { data: any }) => void;
}

const columns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Timestamp',
    icon: appIcons.TIME,
    minWidth: TABLE_COLUMN_SIZES[1]
  },
  {
    id: '2',
    label: 'Status',
    icon: appIcons.STATUS,
    minWidth: TABLE_COLUMN_SIZES[2],
    muiIcon: true
  },
  {
    id: '3',
    label: 'Table Name',
    icon: appIcons.NAME,
    minWidth: TABLE_COLUMN_SIZES[2],
    muiIcon: true
  },
  {
    id: '4',
    label: 'Summary',
    icon: appIcons.MESSAGE,
    minWidth: TABLE_COLUMN_SIZES[4]
  }
];

export const StyledChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4
}));

const BulkerEventsTable = ({ data, onRowClick }: IBulkerEventsTableProps) => {
  return (
    <>
      <TableContainer>
        <Table>
          {/* Live events Columns */}
          <TableHead>
            <TableHeader columns={columns} />
          </TableHead>
          {/* Live events Body */}
          <TableBody>
            {(data.ids as string[]).map((id) => {
              const item = data.entities[id];
              const timestamp = item.date;
              const message = JSON.stringify(item);

              const { content = {} } = item ?? {};

              const { status = '', representation: { name: tableName = '' } = {} } = content;

              return (
                <CustomizedTableRow onClick={() => onRowClick({ data: message })} hover key={`log_key ${id}`}>
                  <TableCell>
                    <Typography variant="subtitle1">{getFormattedUTC(timestamp, false)}</Typography>
                  </TableCell>
                  <TableCell>
                    <StyledChip color={'secondary'} label={status} />
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle1">{tableName}</Typography>
                  </TableCell>

                  <TableCell>
                    <LogMessage variant="subtitle1">{message}</LogMessage>
                  </TableCell>
                </CustomizedTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BulkerEventsTable;
