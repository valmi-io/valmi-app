import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, Paper } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CredentialsColumns } from '@/content/ConnectionFlow/Connectors/CredentialsTableColumns';
import CredentialsTableRow from '@/content/ConnectionFlow/Connectors/CredentialsTableRow';

export interface SyncOnClickProps {
  syncId: string;
}

const CredentialsTable = ({ credentials }: { credentials: any }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleOnClick = ({ credentialId }: { credentialId: string }) => {
    router.push(`/spaces/${workspaceId}/connections/create`);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableHeader columns={CredentialsColumns} />
        </TableHead>
        <TableBody>
          {credentials.map((credential: any) => {
            return (
              <CredentialsTableRow
                key={credential.id}
                credential={credential}
                onClick={() => handleOnClick(credential?.id)}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CredentialsTable;
