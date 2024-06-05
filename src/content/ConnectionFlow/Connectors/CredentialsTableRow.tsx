import React from 'react';

import { Chip, TableCell, TableRow, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { TableCellComponent, TableCellWithImage } from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';

const CustomizedTableRow = styled(TableRow)(({}) => ({
  cursor: 'pointer'
}));

interface CredentialsTableRowProps {
  credential: any;
  onClick: (credentialId: any) => void;
}

const CredentialsTableRow = ({ credential, onClick }: CredentialsTableRowProps) => {
  const getConnectorName = (sync: any, connectionType: any) => {
    return sync[connectionType].credential.connector_type.split('_')[1];
  };
  return (
    <CustomizedTableRow hover key={credential?.id} onClick={() => onClick({ syncId: credential?.id })}>
      <TableCellComponent text={credential?.display_name} />
      <TableCellComponent text={credential?.connector_config?.shop} />
      {/* <TableCellWithImage
        title={sync.source.name}
        size={ImageSize.small}
        src={`/connectors/${getConnectorName(sync, 'source').toLowerCase()}.svg`}
      /> */}

      {/* <TableCellWithImage
        size={ImageSize.small}
        title={sync.destination.name}
        src={`/connectors/${getConnectorName(sync, 'destination').toLowerCase()}.svg`}
      /> */}
    </CustomizedTableRow>
  );
};

export default CredentialsTableRow;
