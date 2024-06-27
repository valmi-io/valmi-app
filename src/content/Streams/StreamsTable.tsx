/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 2nd 2024, 12:20:51 pm
 * Author: Nagendra S @ valmi.io
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow, { TableRowProps } from '@mui/material/TableRow';

import {
  TableCellComponent,
  TableCellWithActionButton,
  TableCellWithImage
} from '@components/Table/TableCellComponent';

import TableHeader from '@components/Table/TableHeader';
import { StreamTableColumns } from './StreamTableColumns';
import { TData } from '@utils/typings.d';
import { ConnectionType } from '../Connections/ConnectionModel';
import { ImageSize } from '@/components/ImageComponent';
import { extStreams } from '@/constants/extDestinations';
import { Paper, styled } from '@mui/material';

interface IStreamsTableProps {
  data: TData;
  id: string | string[];
  onEditClick: ({ edit, streamId }: { edit: boolean; streamId: string }) => void;
  onLiveEventsClick: ({ streamId }: { streamId: string }) => void;
}

const CustomizedTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.colors.alpha.black[5]
  }
}));

const StreamsTable = ({ data, onEditClick, onLiveEventsClick, id: queryId }: IStreamsTableProps) => {
  return (
    <>
      {/* Streams Table*/}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          {/* Streams Table Columns */}
          <TableHead>
            <TableHeader columns={StreamTableColumns} connectionType={ConnectionType.SRC} />
          </TableHead>
          {/* Streams Table Body */}
          <TableBody>
            {(data.ids as string[]).map((id) => {
              const name = data.entities[id].name;
              const type = data.entities[id].type;

              const streamId = data.entities[id].id;
              const streamType = extStreams.browser.type;

              const selected = streamId === queryId;

              return (
                <CustomizedTableRow hover key={id} selected={selected}>
                  <TableCellComponent text={name} />
                  <TableCellWithImage
                    title={type}
                    src={`/connectors/${streamType.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />

                  <TableCellWithActionButton
                    actionType="EDIT"
                    tooltip={'Edit stream'}
                    onClick={() => onEditClick({ edit: true, streamId: id })}
                  />
                  <TableCellWithActionButton
                    actionType="LIVE_EVENTS"
                    tooltip={'Live events'}
                    onClick={() => onLiveEventsClick({ streamId: id })}
                  />
                </CustomizedTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StreamsTable;
