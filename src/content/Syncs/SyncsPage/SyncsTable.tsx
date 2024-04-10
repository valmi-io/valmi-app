// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { Table, TableBody, TableHead, TableContainer } from '@mui/material';

import { RootState } from '@store/reducers';

import SyncTableRow from './SyncTableRow';

import { SyncColumns } from './SyncColumns';
import TableHeader from '@components/Table/TableHeader';

export interface SyncOnClickProps {
  syncId: string;
}

/**
 * Responsible for taking a list of `syncs` prop and rendering them `SyncTableRow`s
 *
 * - Responsible for passing the `syncsColumns` prop to the `SyncTableColumns` component
 * - Responsible for passing the `sync` prop to the `SyncTableRow` component.
 * - Responsible for handling sync `onClick`
 */

const SyncsTable = ({ syncs }) => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const handleOnClick = ({ syncId }: SyncOnClickProps) => {
    // navigate to sync runs
    router.push(`/spaces/${workspaceId}/connections/${syncId}/runs`);
  };

  return (
    <>
      {/* Syncs Table*/}
      <TableContainer>
        <Table>
          {/* Syncs Table Columns */}
          <TableHead>
            <TableHeader columns={SyncColumns} />
          </TableHead>
          {/* Syncs Table Body */}
          <TableBody>
            {syncs.map((sync) => {
              return <SyncTableRow key={sync.id} sync={sync} onClick={handleOnClick} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SyncsTable;
