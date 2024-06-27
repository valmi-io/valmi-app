/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 10th 2024, 10:50:42 am
 * Author: Nagendra S @ valmi.io
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { TableCellWithActionButton, TableCellWithImage } from '@components/Table/TableCellComponent';

import TableHeader from '@components/Table/TableHeader';
import { TData } from '@utils/typings.d';
import { ImageSize } from '@components/ImageComponent';

import { EventConnectionsTableColumns } from '@/content/Events/EventConnectionsTableColumns';
import { extStreams } from '@/constants/extDestinations';

type ButtonProps = {
  edit: boolean;
  id: string;
};

interface IConnectionsTableProps {
  data: TData;
  streams: TData;
  destinations: TData;
  onEditClick: ({ edit, id }: ButtonProps) => void;
  onLiveEventsClick: ({ id }: { id: string }) => void;
}

const getConnectionObj = ({ id, data }: { id: string; data: TData }) => {
  const { ids, entities } = data;

  const obj = ids.find((elementId) => elementId === id);

  if (obj) {
    return entities[obj];
  }
  return {};
};

const EventConnectionsTable = ({
  data,
  streams,
  destinations,
  onEditClick,
  onLiveEventsClick
}: IConnectionsTableProps) => {
  return (
    <>
      {/* EventConnections Table*/}
      <TableContainer>
        <Table>
          {/* EventConnections Table Columns */}
          <TableHead>
            <TableHeader columns={EventConnectionsTableColumns} />
          </TableHead>
          {/* EventConnections Table Body */}
          <TableBody>
            {(data.ids as string[]).map((id) => {
              const fromId = data.entities[id].fromId;
              const toId = data.entities[id].toId;

              const stream = getConnectionObj({ id: fromId, data: streams });
              const destination = getConnectionObj({ id: toId, data: destinations });

              const streamType = extStreams.browser.type;

              const { destinationType = '' } = destination ?? {};

              return (
                <TableRow hover key={id}>
                  <TableCellWithImage
                    alt="streamIcon"
                    title={stream.name}
                    src={`/connectors/${streamType.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />
                  <TableCellWithImage
                    alt="destinationIcon"
                    title={destination.name}
                    src={`/connectors/${destinationType.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />
                  <TableCellWithActionButton
                    tooltip={'Edit connection'}
                    onClick={() =>
                      onEditClick({
                        edit: true,
                        id: id
                      })
                    }
                  />
                  <TableCellWithActionButton
                    actionType="LIVE_EVENTS"
                    tooltip={'Live events'}
                    onClick={() =>
                      onLiveEventsClick({
                        id: id
                      })
                    }
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EventConnectionsTable;
