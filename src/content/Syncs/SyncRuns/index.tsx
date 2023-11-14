/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 30th 2023, 1:03:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState, useEffect, useMemo } from 'react';

import { Card, styled } from '@mui/material';

import SyncRunsTable from '@content/Syncs/SyncRuns/SyncRunsTable';

import { ErrorStatusText } from '@components/Error';
import SkeletonLoader from '@components/SkeletonLoader';
import ListEmptyComponent from '@components/ListEmptyComponent';
import ErrorContainer from '@components/Error/ErrorContainer';
import AlertComponent from '@components/Alert';

import { useSyncRuns } from './useSyncRuns';
import SyncRunsHeader from './SyncRunsHeader';
import { SyncRunRootContext } from '@contexts/Contexts';

const CustomizedCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4)
}));

const SyncRuns = ({ syncId, workspaceId }: any) => {
  // alert dialog states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

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

  useEffect(() => {
    if (syncRuns?.length > 0) {
      const interval = 3000; // in milliseconds

      const runInterval = setInterval(updateLastSync, interval);
      return () => {
        clearInterval(runInterval);
      };
    }
  }, [syncRuns]);

  // Alert open handler
  const handleAlertDialog = (message: string, isError: boolean) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  // Alert close handler
  const handleAlertClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  const rootContextValue = useMemo(
    () => ({ updateLastSync, handleAlertDialog }),
    [updateLastSync]
  );

  // Page content
  const displayContent = () => {
    if (syncRuns.length > 0) {
      // Display Syncruns table
      return <SyncRunsTable syncId={syncId} syncRunsData={syncRuns} />;
    }
    // Display empty component
    return <ListEmptyComponent description={'No runs found in this sync'} />;
  };

  return (
    <SyncRunRootContext.Provider value={rootContextValue}>
      <SyncRunsHeader
        workspaceId={workspaceId}
        syncId={syncId}
        syncRuns={syncRuns}
      />

      <AlertComponent
        open={alertDialog}
        onClose={handleAlertClose}
        message={alertMessage}
        isError={isErrorAlert}
      />

      <CustomizedCard variant="outlined">
        {/** Display Errors */}
        {error && <ErrorContainer error={error} />}

        {/** Display Trace Error */}
        {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

        {/** Display Skeleton */}
        <SkeletonLoader loading={isLoading} />

        {/** Display Content */}
        {!error && !isLoading && syncRuns && displayContent()}
      </CustomizedCard>
    </SyncRunRootContext.Provider>
  );
};

export default SyncRuns;
