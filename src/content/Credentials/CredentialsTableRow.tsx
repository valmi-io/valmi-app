import React from 'react';

import { Avatar, Box, TableCell, TableRow, Typography, styled } from '@mui/material';

import {
  TableCellComponent,
  TableCellWithActionButton,
  TableCellWithImage
} from '@components/Table/TableCellComponent';
import { ImageSize } from '@/components/ImageComponent';
import { stringAvatar } from '@/utils/lib';

interface CredentialsTableRowProps {
  credential: any;
  onClick: (credentialId: any) => void;
}

const UserAccountLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

const CredentialsTableRow = ({ credential, onClick }: CredentialsTableRowProps) => {
  const userAccountTableCell = (account: any) => {
    const { external_id = 'account', profile = '' } = account || {};
    let imageSrc = '';

    if (profile && profile !== 'undefined') {
      imageSrc = profile;
    }

    return (
      <UserAccountLayout>
        <Avatar
          sx={{
            width: 25,
            height: 25,
            marginRight: 1,
            backgroundColor: (theme) => theme.palette.text.disabled
          }}
          src={imageSrc || undefined}
          {...(imageSrc ? {} : stringAvatar(external_id))}
        />
        <Typography variant="body2" color="text.primary" noWrap>
          {external_id}
        </Typography>
      </UserAccountLayout>
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
      <TableCellWithActionButton tooltip={'Edit credential'} onClick={() => onClick({ credential: credential })} />
    </TableRow>
  );
};

export default CredentialsTableRow;
