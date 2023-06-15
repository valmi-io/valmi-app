// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  styled,
  Chip,
  Stack,
  Icon
} from '@mui/material';

import { useSelector } from 'react-redux';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { useRouter } from 'next/router';

import { RootState } from '../../store/reducers';
import {
  TableCellComponent,
  TableCellWithImage
} from '../../components/Table/TableCellComponent';
import { TABLE_COLUMN_SIZES, TableColumnProps } from '../../utils/table-utils';
import { ImageSize } from '../../components/ImageComponent';
import { convertDurationToMinutesOrHours } from '../../utils/lib';
import appIcons from '../../utils/icon-utils';

const syncsColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Name',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.NAME
  },
  {
    id: '2',
    label: 'Warehouse',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.SRC
  },
  { id: '3', label: '', minWidth: TABLE_COLUMN_SIZES[0] },
  {
    id: '4',
    label: 'Destination',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.DEST
  },
  {
    id: '5',
    label: 'Schedule',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.SCHEDULE
  },
  {
    id: '6',
    label: 'Status',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.STATUS
  },
  { id: '7', label: '', action: true, minWidth: TABLE_COLUMN_SIZES[0] }
];

const ChipComponent = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const CustomizedTableRow = styled(TableRow)(({}) => ({
  cursor: 'pointer'
}));

const SyncsTable = ({ syncs }) => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

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

  const navigateToSyncRuns = (record) => {
    router.push(`/spaces/${workspaceId}/syncs/${record.id}/runs`);
  };

  const getConnectorName = (sync, connectionType) => {
    return sync[connectionType].credential.connector_type.split('_')[1];
  };

  return (
    <>
      {/* Syncs Table*/}
      <TableContainer>
        <Table>
          {/* Syncs Table Columns */}
          <TableHead>
            <TableRow>{generateColumns(syncsColumns)}</TableRow>
          </TableHead>
          {/* Syncs Table Body */}
          <TableBody>
            {syncs.length > 0 &&
              syncs.map((sync) => {
                return (
                  <CustomizedTableRow
                    hover
                    key={sync.id}
                    onClick={() => {
                      navigateToSyncRuns(sync);
                    }}
                  >
                    <TableCellComponent text={sync.name} />
                    <TableCellWithImage
                      title={sync.source.name}
                      size={ImageSize.small}
                      src={`/connectors/${getConnectorName(
                        sync,
                        'source'
                      ).toLowerCase()}.svg`}
                    />
                    <TableCell>
                      <ArrowForwardIcon style={{ fontSize: 18 }} />
                    </TableCell>
                    <TableCellWithImage
                      size={ImageSize.small}
                      title={sync.destination.name}
                      src={`/connectors/${getConnectorName(
                        sync,
                        'destination'
                      ).toLowerCase()}.svg`}
                    />
                    <TableCellComponent
                      text={convertDurationToMinutesOrHours(
                        sync.schedule.run_interval
                      )}
                    />

                    <TableCell>
                      <ChipComponent
                        color={
                          sync.status === 'active' ? 'secondary' : 'warning'
                        }
                        label={sync.status}
                      />
                    </TableCell>

                    <TableCell>
                      <NavigateNextIcon style={{ fontSize: 20 }} />
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

export default SyncsTable;
