import React from 'react';

import { Chip, TableCell, TableRow, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { TableCellComponent, TableCellWithImage } from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';
import { convertDurationToMinutesOrHours, getConnectorImageName } from '@utils/lib';
import { ConnOnClickProps } from '@/content/Connections/ConnectionsTable';
import { getValmiDataStoreName, getValmiLogoSrc } from '@/utils/app-utils';

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
    source: { name: sourceName = '', credential: sourceCredentials = {} } = {},
    destination: { name: destinationName = '', credential: destinationCredentials = {} } = {},
    status = '',
    schedule: { run_interval = '' } = {}
  } = conn ?? {};

  let sourceImage =
    sourceName === getValmiDataStoreName()
      ? getValmiLogoSrc()
      : getConnectorImageName({ type: sourceCredentials?.connector_type });
  let destImage =
    destinationName === getValmiDataStoreName()
      ? getValmiLogoSrc()
      : getConnectorImageName({ type: destinationCredentials?.connector_type });

  return (
    <CustomizedTableRow hover key={id} onClick={() => onClick({ connId: id })} selected={selected}>
      <TableCellComponent text={name} />
      <TableCellWithImage title={sourceName} size={ImageSize.small} src={sourceImage} />
      <TableCell>
        <ArrowForwardIcon style={{ fontSize: 18 }} />
      </TableCell>
      <TableCellWithImage size={ImageSize.small} title={destinationName} src={destImage} />
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
