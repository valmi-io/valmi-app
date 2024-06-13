import React from 'react';

import { Chip, TableCell, TableRow, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { TableCellComponent, TableCellWithImage } from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';
import { convertDurationToMinutesOrHours } from '@utils/lib';
import { ConnOnClickProps } from '@/content/Connections/ConnectionsTable';

const ChipComponent = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const CustomizedTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&.Mui-selected': {
    backgroundColor: theme.colors.secondary.lighter
  }
}));

interface ConnTableRowProps {
  conn: any;
  onClick: (connId: ConnOnClickProps) => void;
  selected?: boolean;
}

/**
 * Responsible for rendering `connection`.
 *
 * - Responsible for the styling of the connection.
 * - Responsible for passing `connId` on click.
 */

const ConnectionTableRow = ({ conn, onClick, selected = false }: ConnTableRowProps) => {
  const {
    id = '',
    name = '',
    source: { name: sourceName = '' } = {},
    destination: { name: destinationName = '' } = {},
    status = '',
    schedule: { run_interval = '' } = {}
  } = conn ?? {};

  const getConnectorName = (conn: any, connectionType: any) => {
    return conn[connectionType].credential.connector_type.split('_')[1];
  };

  return (
    <CustomizedTableRow hover key={id} onClick={() => onClick({ connId: id })} selected={selected}>
      <TableCellComponent text={name} />
      <TableCellWithImage
        title={sourceName}
        size={ImageSize.small}
        src={`/connectors/${getConnectorName(conn, 'source').toLowerCase()}.svg`}
      />
      <TableCell>
        <ArrowForwardIcon style={{ fontSize: 18 }} />
      </TableCell>
      <TableCellWithImage
        size={ImageSize.small}
        title={destinationName}
        src={`/connectors/${getConnectorName(conn, 'destination').toLowerCase()}.svg`}
      />
      <TableCellComponent text={convertDurationToMinutesOrHours(run_interval)} />

      <TableCell>
        <ChipComponent color={status === 'active' ? 'secondary' : 'warning'} label={status} />
      </TableCell>

      <TableCell>
        <NavigateNextIcon style={{ fontSize: 20 }} />
      </TableCell>
    </CustomizedTableRow>
  );
};

export default ConnectionTableRow;
