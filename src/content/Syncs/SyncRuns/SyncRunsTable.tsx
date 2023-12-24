// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 5:38:11 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { Table, TableBody, TableContainer, TableHead } from '@mui/material';

import { getErrorInSyncRun } from '@content/Syncs/SyncRuns/SyncRunsUtils';

import AlertComponent from '@components/Alert';

import { RootState } from '@store/reducers';
import { SyncRunColumns } from './SyncRunColumns';
import SyncRunTableRow from './SyncRunTableRow';
import TableHeader from '@components/Table/TableHeader';

type SyncRunsTableProps = {
  syncRunsData: any;
  syncId: string;
};

const SyncRunsTable = ({ syncRunsData, syncId }: SyncRunsTableProps) => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const [errorDialog, showErrorDialog] = useState(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState('');

  {
    /** Sync Run Error */
  }
  const displayError = (syncRun, connection = '') => {
    const syncErrorMessage = getErrorInSyncRun(syncRun, connection);
    setSyncErrorMessage(syncErrorMessage);
    showErrorDialog(true);
  };

  const handleClose = () => {
    showErrorDialog(false);
  };

  const navigateToSyncRunLogs = (syncRun, connection) => {
    router.push({
      pathname: `/spaces/${workspaceId}/syncs/${syncId}/runs/${syncRun.run_id}/logs`,
      query: { connection_type: connection }
    });
  };

  return (
    <>
      <AlertComponent
        open={errorDialog}
        onClose={handleClose}
        message={syncErrorMessage}
        isError={true}
      />
      {/* Syncs Table*/}
      <TableContainer>
        <Table>
          {/* Syncs Table Columns */}
          <TableHead>
            <TableHeader columns={SyncRunColumns} />
          </TableHead>

          {/* Syncs Table Body */}
          <TableBody>
            {syncRunsData &&
              syncRunsData.length > 0 &&
              syncRunsData.map((syncRun, index) => {
                return (
                  <SyncRunTableRow
                    key={`run_key ${index}`}
                    displayError={displayError}
                    syncRun={syncRun}
                    onLogClick={navigateToSyncRunLogs}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SyncRunsTable;
