/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 1:19:25 pm
 * Author: Nagendra S @ valmi.io
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import TableHeader from '@components/Table/TableHeader';

import { TABLE_COLUMN_SIZES, TableColumnProps } from '@/utils/table-utils';
import appIcons from '@/utils/icon-utils';
import { CustomizedTableRow } from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import { Chip, Paper, TableCell, Typography, styled, useTheme } from '@mui/material';
import { getFormattedUTC } from '@/utils/lib';

interface IIncomingEventsTableProps {
  data: any;
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
    label: 'Type',
    icon: appIcons.NAME,
    minWidth: TABLE_COLUMN_SIZES[2],
    muiIcon: true
  },
  {
    id: '3',
    label: 'Host',
    icon: appIcons.BROWSER,
    minWidth: TABLE_COLUMN_SIZES[2],
    muiIcon: true
  },
  {
    id: '4',
    label: 'Email',
    icon: appIcons.ACCOUNT,
    minWidth: TABLE_COLUMN_SIZES[2]
  }
];

export const StyledChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#B497FF'
}));

const IncomingEventsTable = ({ data, onRowClick }: IIncomingEventsTableProps) => {
  const theme = useTheme();
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          {/* Live events Columns */}
          <TableHead>
            <TableHeader columns={columns} />
          </TableHead>
          {/* Live events Body */}
          <TableBody>
            {data.map((item: any) => {
              const timestamp = item.date;
              const message = JSON.stringify(item);

              const body = JSON.parse(item.content?.body || {});

              const { httpPayload = {} } = body ?? {};

              const { context = {} } = httpPayload;

              const { page: { host = '' } = {} } = context;

              const email = context?.traits?.email || httpPayload?.traits?.email;

              const type = httpPayload?.type;

              return (
                <CustomizedTableRow onClick={() => onRowClick({ data: message })} hover key={`log_key ${item.id}`}>
                  <TableCell>
                    <Typography variant="subtitle1">{getFormattedUTC(timestamp, false)}</Typography>
                  </TableCell>

                  <TableCell>
                    <StyledChip size="small" label={type} style={{ backgroundColor: theme.colors.secondary.main }} />
                  </TableCell>

                  <TableCell>
                    <StyledChip size="small" label={host} />
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle1">{email}</Typography>
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

export default IncomingEventsTable;
