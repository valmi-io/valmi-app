/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 2nd 2024, 12:50:52 pm
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
import { DestinationTableColumns } from './DestinationTableColumns';
import { TData } from '@utils/typings.d';
import { ConnectionType } from '@/content/Connections/ConnectionModel';
import { ImageSize } from '@/components/ImageComponent';
import { Paper, styled } from '@mui/material';

type ButtonProps = {
  edit: boolean;
  id: string;
  type: string;
  supertype: string;
};

const CustomizedTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.colors.alpha.black[5]
  }
}));

interface IDestinationsTableProps {
  data: TData;
  id: string | string[];
  handleButtonOnClick: ({ edit, id, supertype, type }: ButtonProps) => void;
}

const DestinationsTable = ({ data, handleButtonOnClick, id: queryId }: IDestinationsTableProps) => {
  return (
    <>
      {/* Destinations Table*/}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          {/* Destinations Table Columns */}
          <TableHead>
            <TableHeader columns={DestinationTableColumns} connectionType={ConnectionType.DEST} />
          </TableHead>
          {/* Destinations Table Body */}
          <TableBody>
            {(data.ids as string[]).map((id) => {
              const name = data.entities[id].name;
              const type = data.entities[id].destinationType;
              const superType = data.entities[id].type;
              const destinationId = data.entities[id].id;
              const selected = destinationId === queryId;
              return (
                <CustomizedTableRow hover key={id} selected={selected}>
                  <TableCellComponent text={name} />
                  <TableCellWithImage
                    title={type}
                    src={`/connectors/${type.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />
                  <TableCellWithActionButton
                    tooltip={'Edit destination'}
                    onClick={() =>
                      handleButtonOnClick({
                        edit: true,
                        id: id,
                        type: type,
                        supertype: superType
                      })
                    }
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

export default DestinationsTable;
