/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 7:06:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Button, Divider, Typography } from '@mui/material';

import { getRouterPathname, isPublicSync } from '@utils/routes';

import {
  generateStopSyncPayload,
  getCurrentSyncRun,
  getPageButtonTitle,
  syncRunNetworkHandler
} from '@content/Syncs/SyncRuns/SyncRunsUtils';
import { useContext } from 'react';
import { SyncRunContext, SyncRunRootContext } from '../../../contexts/Contexts';
import { useLazyAbortSyncRunByIdQuery } from '../../../store/api/apiSlice';

type props = {
  closePopover: () => void;
  query: any;
  url: string;
  currentSyncRun: any;
  workspaceId: string;
};

const StopSyncPopoverComponent = ({ closePopover, query, url, currentSyncRun, workspaceId }: props) => {
  // Sync run abort query
  const [abortSyncRunQuery] = useLazyAbortSyncRunByIdQuery();

  const { updateLastSync, handleAlertDialog } = useContext(SyncRunRootContext);

  const { isPromisePending, setIsPromisePending } = useContext(SyncRunContext);

  const handlePromiseStatus = (status: boolean) => {
    setIsPromisePending(status);
  };

  const handleAlertDialogStatus = (msg: string, error: boolean) => {
    handleAlertDialog(msg, error);
  };

  const successHandler = (trace: any, res: any) => {
    let isErrorAlert = false;
    if (trace) {
      isErrorAlert = true;
      handleAlertDialogStatus(trace, isErrorAlert);
      handlePromiseStatus(false);
    } else {
      updateLastSync();
      handleAlertDialogStatus(`Sync run terminated successfully`, isErrorAlert);
      handlePromiseStatus(false);
    }
  };

  const errorHandler = (err: any) => {
    let isErrorAlert = true;
    handleAlertDialogStatus(err, isErrorAlert);
    handlePromiseStatus(false);
  };

  // sync run stop handler
  const stopSyncRun = () => {
    closePopover();

    handlePromiseStatus(true);
    // current running sync

    // const currentSyncRun = getCurrentSyncRun(syncRuns);

    const syncId = currentSyncRun.sync_id;
    const runId = currentSyncRun.run_id;

    // generate stop sync run payload
    const payload = generateStopSyncPayload(workspaceId, syncId, runId);

    syncRunNetworkHandler(abortSyncRunQuery, payload, successHandler, errorHandler);
  };

  return (
    <>
      <Box sx={{ padding: (theme) => theme.spacing(3) }}>
        <Typography variant="body1">This sync is currently in progress. Do you want to stop it?</Typography>
      </Box>
      <Divider />

      <Box sx={{ m: 1, display: 'flex' }}>
        <Button fullWidth onClick={closePopover}>
          <Typography variant="body1" color="secondary">
            NO
          </Typography>
        </Button>
        <Button fullWidth onClick={stopSyncRun}>
          <Typography variant="body1" color="error">
            {getPageButtonTitle(isPublicSync(getRouterPathname(query, url)), currentSyncRun, isPromisePending)}
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default StopSyncPopoverComponent;
