import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, Paper } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CredentialsColumns } from '@/content/Credentials/CredentialsTableColumns';
import CredentialsTableRow from '@/content/Credentials/CredentialsTableRow';
import { TCredential } from '@/utils/typings.d';
import {
  getCredentialObjKey,
  getExtrasObjKey,
  getSelectedConnectorKey,
  getSelectedConnectorObj
} from '@/utils/connectionFlowUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { redirectToEditDataFlow } from '@/utils/router-utils';

export interface SyncOnClickProps {
  syncId: string;
}

const CredentialsTable = ({ credentials, id: queryId }: { credentials: TCredential[]; id: string }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const handleCredentialEdit = ({ credential }: { credential: TCredential }) => {
    const key = getSelectedConnectorKey();

    const {
      account = {},
      connector_config = {},
      name: sourceCredentialName = '',
      id: sourceCredentialId,
      ...item
    } = credential ?? {};

    const obj = getSelectedConnectorObj(item, key);

    const objToDispatch = {
      ids: [key, getCredentialObjKey(obj.type), getExtrasObjKey()],
      entities: {
        [key]: getSelectedConnectorObj(item, key),
        [getCredentialObjKey(obj.type)]: {
          config: {
            ...connector_config,
            name: sourceCredentialName,
            id: sourceCredentialId
          },
          account: account
        },
        [getExtrasObjKey()]: {
          isEditableFlow: true
        }
      }
    };

    dispatch(setConnectionFlowState(objToDispatch));

    redirectToEditDataFlow({ router: router, wid: workspaceId });
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableHeader columns={CredentialsColumns} />
        </TableHead>
        <TableBody>
          {credentials.map((credential: TCredential) => {
            const sourceId = credential?.id;
            const selected = sourceId === queryId;
            return (
              <CredentialsTableRow
                key={credential.id}
                credential={credential}
                onClick={handleCredentialEdit}
                selected={selected}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CredentialsTable;
