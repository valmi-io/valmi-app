// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  Avatar,
  Typography,
  styled
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { ConnectionModel } from '@content/Connections/ConnectionModel';

import {
  TableCellComponent,
  TableCellWithActionButton,
  TableCellWithImage
} from '@components/Table/TableCellComponent';
import { ImageSize } from '@components/ImageComponent';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

import { stringAvatar } from '@utils/lib';
import { ConnectionColumns } from './ConnectionColumns';
import TableHeader from '../../components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

interface ConnectionsTableProps {
  className?: string;
  connections: ConnectionModel[];
  connectionType: string;
}

const BoxLayout = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectionsTable = ({ connections = [], connectionType = '' }: ConnectionsTableProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  /** Redux store */
  const connection_flow = useSelector((state: RootState) => state.connectionFlow);
  const { flowState: {} = {} } = connection_flow;

  const { workspaceId = '' } = useWorkspaceId();

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
          display_name: connection.display_name,
          oauth_keys: connection.oauth_keys
        }
      })
    );
    router.push(`/spaces/${workspaceId}/connections/create`);
  };

  const userAccountTableCell = (account) => {
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

  return (
    <>
      {/* Connections Table*/}
      <TableContainer>
        <Table>
          {/* Connections Table Columns */}
          <TableHead>
            <TableHeader columns={ConnectionColumns} connectionType={connectionType} />
          </TableHead>
          {/* Connections Table Body */}
          <TableBody>
            {connections.map((connection) => {
              return (
                <TableRow hover key={connection.id}>
                  <TableCellComponent text={connection.name} />
                  <TableCell>{userAccountTableCell(connection.account)}</TableCell>
                  <TableCellWithImage
                    title={connection.display_name}
                    src={`/connectors/${connection.type.toLowerCase()}.svg`}
                    size={ImageSize.small}
                  />
                  <TableCellWithActionButton
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
