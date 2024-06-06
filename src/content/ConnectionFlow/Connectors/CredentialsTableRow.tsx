import React from 'react';

import { Avatar, Chip, TableCell, TableRow, Typography, styled } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import {
  TableCellComponent,
  TableCellWithActionButton,
  TableCellWithImage
} from '@components/Table/TableCellComponent';
import { ImageSize } from '@/components/ImageComponent';
import { BoxLayout } from '@/components/Layouts/Layouts';
import { stringAvatar } from '@/utils/lib';

interface CredentialsTableRowProps {
  credential: any;
  onClick: (credentialId: any) => void;
}

const CredentialsTableRow = ({ credential, onClick }: CredentialsTableRowProps) => {
  console.log('CREDS:', credential);

  const userAccountTableCell = (account: any) => {
    const { external_id = 'account', profile = '' } = account || {};
    let imageSrc = '';

    if (profile && profile !== 'undefined') {
      imageSrc = profile;
    }

    return (
      <BoxLayout display="flex">
        <Avatar
          sx={{
            width: 25,
            height: 25,
            marginRight: (theme) => theme.spacing(1),
            backgroundColor: (theme) => theme.palette.text.disabled
          }}
          src={imageSrc || undefined}
          {...(imageSrc ? {} : stringAvatar(external_id))}
        />
        <Typography variant="body2" color="text.primary" noWrap>
          {external_id}
        </Typography>
      </BoxLayout>
    );
  };

  const getNameCellValue = (connector: any) => {
    let type = connector?.display_name?.toLowerCase();
    if (type === 'shopify') {
      return connector?.connector_config?.shop;
    } else if (type === 'postgres' || type === 'dest postgres') {
      return connector?.connector_config?.database;
    } else return connector?.connector_type;
  };
  return (
    <TableRow hover key={credential?.id}>
      <TableCellComponent text={getNameCellValue(credential)} />
      <TableCell>{userAccountTableCell(credential?.account)}</TableCell>
      <TableCellWithImage
        title={credential?.display_name}
        src={`/connectors/${credential?.connector_type?.split('_')[1].toLowerCase()}.svg`}
        size={ImageSize.small}
      />
      <TableCellWithActionButton
        tooltip={'Edit connection'}
        onClick={() => onClick({ connectionId: credential?.id })}
      />
    </TableRow>
  );
};

export default CredentialsTableRow;
