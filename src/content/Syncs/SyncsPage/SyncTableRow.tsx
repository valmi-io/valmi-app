/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, November 9th 2023, 3:59:34 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Chip, TableCell, TableRow, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import {
  TableCellComponent,
  TableCellWithImage
} from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';
import { convertDurationToMinutesOrHours } from '@utils/lib';
import { SyncOnClickProps } from './SyncsTable';

const ChipComponent = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const CustomizedTableRow = styled(TableRow)(({}) => ({
  cursor: 'pointer'
}));

interface SyncTableRowProps {
  sync: any;
  onClick: (syncId: SyncOnClickProps) => void;
}

/**
 * Responsible for rendering `sync`.
 *
 * - Responsible for the styling of the sync.
 * - Responsible for passing `syncId` on click.
 */

const SyncTableRow = ({ sync, onClick }: SyncTableRowProps) => {
  const getConnectorName = (sync: any, connectionType: any) => {
    return sync[connectionType].credential.connector_type.split('_')[1];
  };
  return (
    <CustomizedTableRow
      hover
      key={sync.id}
      onClick={() => onClick({ syncId: sync.id })}
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
        text={convertDurationToMinutesOrHours(sync.schedule.run_interval)}
      />

      <TableCell>
        <ChipComponent
          color={sync.status === 'active' ? 'secondary' : 'warning'}
          label={sync.status}
        />
      </TableCell>

      <TableCell>
        <NavigateNextIcon style={{ fontSize: 20 }} />
      </TableCell>
    </CustomizedTableRow>
  );
};

export default SyncTableRow;
