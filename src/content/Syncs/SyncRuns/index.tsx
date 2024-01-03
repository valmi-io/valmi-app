/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 30th 2023, 1:03:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState, useEffect, useMemo } from 'react';

import { useTheme } from '@mui/material';

import SyncRunsTable from '@content/Syncs/SyncRuns/SyncRunsTable';

import ListEmptyComponent from '@components/ListEmptyComponent';
import AlertComponent from '@components/Alert';

import { useSyncRuns } from './useSyncRuns';
import SyncRunsHeader from './SyncRunsHeader';
import { SyncRunRootContext } from '@contexts/Contexts';
import ContentLayout from '@/layouts/ContentLayout';

/**
 * Responsible for displaying `Runs` page and its components.
 *
 * Queries for `SyncRuns` using `useSyncRuns` hook.
 * @param syncId
 * @param workspaceId
 */

const SyncRuns = ({ syncId, workspaceId }: any) => {
  const theme = useTheme();
  // alert dialog states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  /**
   * Hook -  Responsible for fetching sync runs.
   *
   * @returns states needed to update the UI.
   */
  const {
    data: syncRuns,
    error,
    updateLastSync,
    isLoading,
    traceError
  } = useSyncRuns({
    syncId: syncId,
    workspaceId: workspaceId
  });

  /**
   * Fetches sync runs every 3 seconds by updating last sync timestamp
   */
  useEffect(() => {
    if (syncRuns?.length > 0) {
      const interval = 3000; // in milliseconds

      const runInterval = setInterval(updateLastSync, interval);
      return () => {
        clearInterval(runInterval);
      };
    }
  }, [syncRuns]);

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertDialog = (message: string, isError: boolean) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  /**
   * Context - which can be accessed by children down the UI Tree.
   * @returns updateLastSync, handleAlertDialog.
   */
  const rootContextValue = useMemo(() => ({ updateLastSync, handleAlertDialog }), [updateLastSync]);

  /**
   * Responsible for displaying Runs Table and EmptyRuns.
   * @returns Runs, Empty Component based on data.
   */
  const PageContent = () => {
    if (syncRuns.length > 0) {
      return <SyncRunsTable syncId={syncId} syncRunsData={syncRuns} />;
    }

    return <ListEmptyComponent description={'No runs found in this sync'} />;
  };

  return (
    <SyncRunRootContext.Provider value={rootContextValue}>
      <SyncRunsHeader workspaceId={workspaceId} syncId={syncId} syncRuns={syncRuns} />

      <AlertComponent open={alertDialog} onClose={handleAlertClose} message={alertMessage} isError={isErrorAlert} />

      <ContentLayout
        key={`syncsRunsPage-${syncId}`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && syncRuns}
        isLoading={isLoading}
        traceError={traceError}
        cardStyles={{ marginTop: theme.spacing(4) }}
      />
    </SyncRunRootContext.Provider>
  );
};

export default SyncRuns;
