import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, Paper } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CredentialsColumns } from '@/content/Credentials/CredentialsTableColumns';
import CredentialsTableRow from '@/content/Credentials/CredentialsTableRow';
import { TCredential } from '@/utils/typings.d';

export interface SyncOnClickProps {
  syncId: string;
}

const CredentialsTable = ({ credentials }: { credentials: TCredential[] }) => {
  console.log('Credentials', credentials);
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleCredentialEdit = ({ credential }: { credential: TCredential }) => {
    console.log('handle on click:_', credential);
    // redirect to connections/create page.
    // router.push(`/spaces/${workspaceId}/connections/create`);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableHeader columns={CredentialsColumns} />
        </TableHead>
        <TableBody>
          {credentials.map((credential: TCredential) => {
            return <CredentialsTableRow key={credential.id} credential={credential} onClick={handleCredentialEdit} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CredentialsTable;
