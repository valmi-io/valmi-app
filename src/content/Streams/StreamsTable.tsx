/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 2nd 2024, 12:20:51 pm
 * Author: Nagendra S @ valmi.io
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { TableCellComponent, TableCellWithEditButton, TableCellWithImage } from '@components/Table/TableCellComponent';

import TableHeader from '@components/Table/TableHeader';
import { StreamTableColumns } from './StreamTableColumns';
import { TData } from '@utils/typings.d';
import { ConnectionType } from '../Connections/ConnectionModel';
import { ImageSize } from '@/components/ImageComponent';

interface IStreamsTableProps {
  data: TData;
  handleButtonOnClick: ({ edit, streamId }: { edit: boolean; streamId: string }) => void;
}

const StreamsTable = ({ data, handleButtonOnClick }: IStreamsTableProps) => {
  return (
    <>
      {/* Streams Table*/}
      <TableContainer>
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
              const streamType = 'chrome';

              return (
                <TableRow hover key={id}>
                  <TableCellComponent text={name} />
                  <TableCellWithImage
                    title={type}
                    src={`/connectors/${streamType.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />

                  <TableCellWithEditButton
                    tooltip={'Edit stream'}
                    onClick={() => handleButtonOnClick({ edit: true, streamId: id })}
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

export default StreamsTable;
