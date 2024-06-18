/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 7:06:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Button, Divider, Switch, Typography, styled } from '@mui/material';

import { getRouterPathname, isPublicSync } from '@utils/routes';

import {
  generateStartSyncPayload,
  getPageButtonTitle,
  syncRunNetworkHandler
} from '@content/Syncs/SyncRuns/SyncRunsUtils';
import { useContext, useState } from 'react';
import { SyncRunContext, SyncRunRootContext } from '../../../contexts/Contexts';
import { useLazyCreateNewSyncRunQuery } from '../../../store/api/apiSlice';

const StartSyncOptionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.alpha.black[5],
  padding: theme.spacing(2)
}));

type props = {
  closePopover: () => void;
  query: any;
  url: string;
  currentSyncRun: any;
  workspaceId: string;
  syncId: string;
};

const StartSyncPopoverComponent = ({ closePopover, query, url, currentSyncRun, workspaceId, syncId }: props) => {
  // Create a new sync run query
  const [createNewSyncRunQuery] = useLazyCreateNewSyncRunQuery();

  const { isPromisePending, setIsPromisePending } = useContext(SyncRunContext);
  const { updateLastSync, handleAlertDialog } = useContext(SyncRunRootContext);

  const [fullRefresh, setFullRefresh] = useState(false);

  // full_refresh switch on change handler
  const handleFullRefreshChange = (e: React.ChangeEvent<HTMLInputElement>, val: any) => {
    e.stopPropagation();
    setFullRefresh(val);
  };

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
      const message = res?.message || 'unknown';
      if (res.success) {
        updateLastSync();
        handleAlertDialogStatus(message, isErrorAlert);
      } else {
        isErrorAlert = true;
        const message = res?.message || 'unknown error';
        handleAlertDialogStatus(message, isErrorAlert);
      }
      handlePromiseStatus(false);
    }
  };

  const errorHandler = (err: any) => {
    let isErrorAlert = true;
    handleAlertDialogStatus(err, isErrorAlert);
    handlePromiseStatus(false);
  };

  // sync run start handler
  const startSyncRun = () => {
    // close popover
    closePopover();

    // set promise status to true
    handlePromiseStatus(true);

    // generate start sync run payload
    const payload = generateStartSyncPayload(workspaceId, syncId, fullRefresh);

    syncRunNetworkHandler(createNewSyncRunQuery, payload, successHandler, errorHandler);
  };

  return (
    <>
      <StartSyncOptionsBox>
        <Box>
          <Switch
            disabled={false}
            size="medium"
            checked={fullRefresh}
            onChange={(event, checked) => {
              handleFullRefreshChange(event, checked);
            }}
          />
        </Box>
        <Typography variant="body2">full_refresh</Typography>
      </StartSyncOptionsBox>
      <Divider />

      <Box sx={{ m: 1 }}>
        <Button fullWidth onClick={startSyncRun}>
          <Typography variant="body1" color="secondary">
            {getPageButtonTitle(currentSyncRun, isPromisePending)}
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default StartSyncPopoverComponent;
