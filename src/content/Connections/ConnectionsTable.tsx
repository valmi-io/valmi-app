// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC } from 'react';

import { useRouter } from 'next/router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Stack,
  Icon,
  Box,
  Avatar,
  Typography,
  styled
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { ConnectionModel } from '@content/Connections/ConnectionModel';

import {
  TableCellComponent,
  TableCellWithEditButton,
  TableCellWithImage
} from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

import { TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';
import { stringAvatar } from '@utils/lib';

interface ConnectionsTableProps {
  className?: string;
  connections: ConnectionModel[];
  connectionType: string;
}

const connectionColumns: TableColumnProps[] = [
  { id: '1', label: 'Name', minWidth: 300, icon: appIcons.NAME },
  { id: '2', label: 'Account', minWidth: 300, icon: appIcons.ACCOUNT },
  { id: '3', label: 'Connector', minWidth: 300, icon: 'CUSTOM' },
  { id: '4', label: '', align: 'right', action: true, minWidth: 100 }
];

const BoxLayout = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectionsTable: FC<ConnectionsTableProps> = ({
  connections,
  connectionType
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  /** Redux store */
  const connection_flow = useSelector(
    (state: RootState) => state.connectionFlow
  );
  const { flowState: {} = {} } = connection_flow;

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const generateColumns = (columns: TableColumnProps[]) => {
    return columns.map((column) => {
      return (
        <TableCell key={column.id} align={column.align}>
          <Stack direction="row" alignItems="center">
            {column.icon && (
              <Icon sx={{ marginRight: (theme) => theme.spacing(1) }}>
                {column.icon === 'CUSTOM'
                  ? appIcons[connectionType]
                  : column.icon}
              </Icon>
            )}
            {column.label}
          </Stack>
        </TableCell>
      );
    });
  };

  const handleEditConnectionClick = (connection) => {
    // setconnectionflow
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,
        connector_config: connection.config,
        connection_data: connection,
        connection_title: connection.name,
        isEditableFlow: true,
        selected_connector: {
          type: connectionType + '_' + connection.type,
          display_name: connection.display_name
        }
      })
    );
    router.push(`/spaces/${workspaceId}/connections/create`);
  };

  const userAccountTableCell = (account) => {
    const { external_id = 'account', profile = '' } = account || {};
    let imageSrc = '';

    if (profile) {
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

  return (
    <>
      {/* Connections Table*/}
      <TableContainer>
        <Table>
          {/* Connections Table Columns */}
          <TableHead>
            <TableRow>{generateColumns(connectionColumns)}</TableRow>
          </TableHead>
          {/* Connections Table Body */}
          <TableBody>
            {connections.map((connection) => {
              return (
                <TableRow hover key={connection.id}>
                  <TableCellComponent text={connection.name} />
                  <TableCell>
                    {userAccountTableCell(connection.account)}
                  </TableCell>
                  <TableCellWithImage
                    title={connection.display_name}
                    src={`/connectors/${connection.type.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />
                  <TableCellWithEditButton
                    tooltip={'Edit connection'}
                    onClick={() => handleEditConnectionClick(connection)}
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

export default ConnectionsTable;
