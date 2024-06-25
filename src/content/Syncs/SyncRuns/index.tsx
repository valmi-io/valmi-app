import { useState, useEffect, useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material';

import SyncRunsTable from '@content/Syncs/SyncRuns/SyncRunsTable';

import ListEmptyComponent from '@components/ListEmptyComponent';
import AlertComponent from '@components/Alert';

import { useSyncRuns } from './useSyncRuns';
import SyncRunsHeader from './SyncRunsHeader';
import { SyncRunRootContext } from '@contexts/Contexts';
import ContentLayout from '@/layouts/ContentLayout';
import { getSyncDetails } from '@store/api/apiSlice';
import { useSelector } from 'react-redux';
import { isDataEmpty } from '@/utils/lib';
import { TData } from '@/utils/typings.d';
import { getValmiDataStoreName } from '@/utils/app-utils';

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

  const [runs, setRuns] = useState<{ ids: string[]; entities: {} }>({
    ids: [],
    entities: {}
  });

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

  const { selectSyncById } = getSyncDetails(workspaceId, syncId);
  const connectionData = useSelector((state) => selectSyncById(state, syncId));

  /**
   * Fetches sync runs every 3 seconds by updating last sync timestamp
   */
  useEffect(() => {
    if (syncRuns?.length > 0) {
      setRunsData(syncRuns);
    }
  }, [syncRuns]);

  const setRunsData = (data: any) => {
    const objs = data;

    const ids: string[] = [];
    const entities: any = {};

    objs.forEach((obj: any) => {
      const runId = obj?.run_id;
      if (!ids.includes(runId)) {
        ids.push(runId);
      }
      entities[runId] = obj;
    });

    setRuns({
      ids: ids,
      entities: entities
    });
  };

  useEffect(() => {
    if (!isDataEmpty(runs) && !error && !traceError) {
      const interval = 5000; // in milliseconds
      const runInterval = setInterval(updateLastSync, interval);
      return () => {
        clearInterval(runInterval);
      };
    }
  }, [runs, error, traceError]);

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertDialog = useCallback(
    (message: string, isError: boolean) => {
      showAlertDialog(true);
      setIsErrorAlert(isError);
      setAlertMessage(message);
    },
    [syncId]
  );

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = useCallback(() => {
    setAlertMessage('');
    showAlertDialog(false);
  }, [syncId]);

  /**
   * Context - which can be accessed by children down the UI Tree.
   * @returns updateLastSync, handleAlertDialog.
   */
  const rootContextValue = useMemo(() => ({ updateLastSync, handleAlertDialog }), [updateLastSync]);

  const currentSyncRun: any = () => {
    if (runs.ids.length > 0) {
      const currentId = runs.ids[0];
      //@ts-ignore
      return runs.entities[currentId];
    }
    return null;
  };
  return (
    <SyncRunRootContext.Provider value={rootContextValue}>
      <SyncRunsHeader workspaceId={workspaceId} syncId={syncId} currentSyncRun={currentSyncRun()} />

      <AlertComponent
        key={`alert-${syncId}`}
        open={alertDialog}
        onClose={handleAlertClose}
        message={alertMessage}
        isError={isErrorAlert}
      />

      <ContentLayout
        key={`syncsRunsPage-${syncId}`}
        error={error}
        PageContent={<PageContent connectionData={connectionData} data={runs} syncId={syncId} />}
        displayComponent={!error && !isLoading && !!runs.ids.length}
        isLoading={isLoading}
        traceError={traceError}
        cardStyles={{ marginTop: theme.spacing(1) }}
      />
    </SyncRunRootContext.Provider>
  );
};

/**
 * Responsible for displaying Runs Table and EmptyRuns.
 * @returns Runs, Empty Component based on data.
 */
const PageContent = ({ data, syncId, connectionData }: { data: TData; syncId: string; connectionData: any }) => {
  const isRetlFlow = useMemo(() => {
    if (connectionData) {
      return connectionData?.source?.name === getValmiDataStoreName() &&
        connectionData?.destination?.name === 'DEST_GOOGLE-SHEETS'
        ? true
        : false;
    }
  }, [connectionData]);

  if (!isDataEmpty(data)) {
    return <SyncRunsTable syncId={syncId} syncRunsData={data} isRetlFlow={!!isRetlFlow} />;
  }

  return <ListEmptyComponent description={'No runs found in this sync'} />;
};

export default SyncRuns;
