import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, TableRow, styled } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CredentialsColumns } from '@/content/ConnectionFlow/Connectors/CredentialsTableColumns';
import CredentialsTableRow from '@/content/ConnectionFlow/Connectors/CredentialsTableRow';

export interface SyncOnClickProps {
  syncId: string;
}

//@ts-ignore
const CredentialsTable = ({ credentials }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleOnClick = ({ syncId }: SyncOnClickProps) => {
    // navigate to sync runs
    router.push(`/spaces/${workspaceId}/connections/${syncId}/runs`);
  };

  return (
    <TableContainer>
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
