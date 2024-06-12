// @ts-nocheck
import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, Paper } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { redirectToConnectionRuns } from '@/utils/router-utils';
import { ConnectionColumns } from '@/content/Connections/ConnectionColumns';
import ConnectionTableRow from '@/content/Connections/ConnectionTableRow';

export interface ConnOnClickProps {
  connId: string;
}

/**
 * Responsible for taking a list of `connections` prop and rendering them `ConnectionTableRow`s
 *
 * - Responsible for passing the `connectionColumns` prop to the `ConnectionTableColumns` component
 * - Responsible for passing the `conn` prop to the `ConnectionTableRow` component.
 * - Responsible for handling conn `onClick`
 */

const ConnectionsTable = ({ connections, id: queryId }: { connections: any; id: string }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleOnClick = ({ connId }: ConnOnClickProps) => {
    // navigate to connection runs
    redirectToConnectionRuns({ router, wid: workspaceId, connId: connId });
  };

  return (
    <>
      {/* Connections Table*/}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          {/* Connections Table Columns */}
          <TableHead>
            <TableHeader columns={ConnectionColumns} />
          </TableHead>
          {/* Connections Table Body */}
          <TableBody>
            {connections.map((connection) => {
              console.log('CONNECTION ITEM:', connection);
              const sourceId = connection?.source?.id;
              const selected = sourceId === queryId;
              return (
                <ConnectionTableRow key={connection.id} conn={connection} onClick={handleOnClick} selected={selected} />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ConnectionsTable;
