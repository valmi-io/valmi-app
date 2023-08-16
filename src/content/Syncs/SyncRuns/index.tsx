/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 30th 2023, 1:03:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Switch,
  Typography,
  styled
} from '@mui/material';
import {
  useLazyAbortSyncRunByIdQuery,
  useLazyCreateNewSyncRunQuery,
  useLazyGetSyncRunsByIdQuery
} from '../../../store/api/apiSlice';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../../components/Error/ErrorUtils';
import { useRouter } from 'next/router';
import { ErrorStatusText } from '../../../components/Error';
import SkeletonLoader from '../../../components/SkeletonLoader';
import SyncRunsTable from './SyncRunsTable';
import PageTitle from '../../../components/PageTitle';
import { SkeletonContainer } from '../../../components/Layouts/Layouts';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import ErrorContainer from '../../../components/Error/ErrorContainer';
import {
  getCurrentSyncRun,
  getPageButtonTitle,
  hasRunningSyncs,
  syncRunNetworkHandler
} from './SyncRunsUtils';
import AlertComponent from '../../../components/Alert';
import PopoverComponent from '../../../components/Popover';
import { getRouterPathname, isPublicSync } from '../../../utils/routes';
import { sendErrorToBugsnag } from '../../../lib/bugsnag';

const CustomizedCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4)
}));

const StartSyncOptionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.alpha.black[5],
  padding: theme.spacing(2)
}));

const SyncRuns = ({ syncId, workspaceId }: any) => {
  const router = useRouter();

  const url = router.pathname;
  const query = router.query;

  // Sync runs query
  const [getSyncRuns, { data, isLoading, isError, error }] =
    useLazyGetSyncRunsByIdQuery();

  // Create a new sync run query
  const [createNewSyncRunQuery] = useLazyCreateNewSyncRunQuery();

  // Sync run abort query
  const [abortSyncRunQuery] = useLazyAbortSyncRunByIdQuery();

  // states
  const [lastSync, setLastSync] = useState(new Date().toISOString());

  const [displayError, setDisplayError] = useState(null);
  const [syncRuns, setSyncRuns] = useState([]);

  const [isQueryPending, setIsQueryPending] = useState(false);
  const [syncRunsFetchError, setSyncRunsFetchError] = useState(false);

  // alert dialog states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  // Popover states

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [fullRefresh, setFullRefresh] = useState(false);

  useEffect(() => {
    if (syncRuns.length > 0) {
      const runInterval = setInterval(() => {
        setLastSync(new Date().toISOString());
      }, 3000);

      return () => {
        clearInterval(runInterval);
      };
    }
  }, [syncRuns]);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchSyncRuns = () => {
      const publicWorkspaceId = process.env.PUBLIC_WORKSPACE;
      const publicSyncId = process.env.PUBLIC_SYNC;

      // extracting workspace id and syncid from router.pathname
      const pathname = getRouterPathname(query, url);

      let syncPayload = {
        syncId: isPublicSync(pathname) ? publicSyncId : syncId,
        workspaceId: isPublicSync(pathname) ? publicWorkspaceId : workspaceId,
        before: lastSync,
        limit: 25
      };
      getSyncRuns(syncPayload);
    };

    // Fetch sync runs if current network request is successful.
    if (!isLoading && !syncRunsFetchError) {
      fetchSyncRuns();
    }
  }, [lastSync, syncId, router.isReady]);

  useEffect(() => {
    // syncRuns data
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setSyncRunsFetchError(true);

        // send error to bugsnag
        sendErrorToBugsnag(traceError);

        setDisplayError(traceError);
      } else {
        setSyncRunsFetchError(false);
        setSyncRuns(data);
      }
    }
  }, [data]);

  useEffect(() => {
    // syncRuns Error handling
    if (isError) {
      // send error to bugsnag
      sendErrorToBugsnag(error);
      setSyncRunsFetchError(true);
    }
  }, [isError]);

  // sync run on Click handler
  const toggleSyncRun = (event: React.MouseEvent<HTMLButtonElement>) => {
    openPopover(event);
  };

  // stop sync run handler
  const stopSyncRun = () => {
    closePopover();

    setIsQueryPending(true);
    // current running sync
    const currentSyncRun = getCurrentSyncRun(syncRuns);

    const syncId = currentSyncRun.sync_id;
    const runId = currentSyncRun.run_id;

    const payload = {
      workspaceId: workspaceId,
      syncId: syncId,
      runId: runId
    };

    // query to stop the sync
    const query = abortSyncRunQuery;

    let isErrorAlert = false;
    syncRunNetworkHandler(
      query,
      payload,
      (trace: any, res: any) => {
        if (trace) {
          isErrorAlert = true;
          displayAlertDialog(trace, isErrorAlert);
          setIsQueryPending(false);
        } else {
          setLastSync(new Date().toISOString());
          displayAlertDialog(`Sync run terminated successfully`, isErrorAlert);
          setIsQueryPending(false);
        }
      },
      (err: any) => {
        isErrorAlert = true;
        displayAlertDialog(err, isErrorAlert);
        setIsQueryPending(false);
      }
    );
  };

  // start sync run handler
  const startSyncRun = () => {
    // close popover
    closePopover();

    setIsQueryPending(true);
    const payload = {
      workspaceId: workspaceId,
      syncId: syncId,
      config: {
        full_refresh: fullRefresh
      }
    };

    // query to start the sync
    const query = createNewSyncRunQuery;

    let isErrorAlert = false;
    syncRunNetworkHandler(
      query,
      payload,
      (trace: any, res: any) => {
        if (trace) {
          isErrorAlert = true;
          displayAlertDialog(trace, isErrorAlert);
          setIsQueryPending(false);
        } else {
          const message = res?.message || 'unknown';
          if (res.success) {
            setLastSync(new Date().toISOString());
            displayAlertDialog(message, isErrorAlert);
          } else {
            isErrorAlert = true;
            const message = res?.message || 'unknown error';
            displayAlertDialog(message, isErrorAlert);
          }
          setIsQueryPending(false);
        }
      },
      (err: any) => {
        isErrorAlert = true;
        displayAlertDialog(err, isErrorAlert);
        setIsQueryPending(false);
      }
    );
  };

  // Popover open handler
  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // popover onCloseHandler
  const closePopover = (): void => {
    setAnchorEl(null);
  };

  // display Alert dialog
  const displayAlertDialog = (message: string, isError: boolean) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  // alert dialog onCloseHandler
  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  // full_refresh switch on change handler
  const handleSwitchOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    val: any
  ) => {
    event.stopPropagation();
    setFullRefresh(val);
  };

  const displayStopSyncPopoverContent = () => {
    return (
      <>
        <Box sx={{ padding: (theme) => theme.spacing(3) }}>
          <Typography variant="body1">
            This sync is currently in progress. Do you want to stop it?
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ m: 1, display: 'flex' }}>
          <Button color="primary" fullWidth onClick={closePopover}>
            <Typography variant="body1">NO</Typography>
          </Button>
          <Button color="primary" fullWidth onClick={stopSyncRun}>
            <Typography variant="body1">
              {getPageButtonTitle(
                isPublicSync(getRouterPathname(query, url)),
                syncRuns,
                isQueryPending
              )}
            </Typography>
          </Button>
        </Box>
      </>
    );
  };

  const displayStartSyncPopoverContent = () => {
    return (
      <>
        <StartSyncOptionsBox>
          <Box>
            <Switch
              disabled={false}
              size="medium"
              checked={fullRefresh}
              onChange={(event, checked) => {
                handleSwitchOnChange(event, checked);
              }}
            />
          </Box>
          <Typography variant="body2">full_refresh</Typography>
        </StartSyncOptionsBox>
        <Divider />

        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={startSyncRun}>
            <Typography variant="body1">
              {getPageButtonTitle(
                isPublicSync(getRouterPathname(query, url)),
                syncRuns,
                isQueryPending
              )}
            </Typography>
          </Button>
        </Box>
      </>
    );
  };

  // Popover content
  const displayPopoverContent = () => {
    return hasRunningSyncs(syncRuns)
      ? displayStopSyncPopoverContent()
      : displayStartSyncPopoverContent();
  };

  // Page content
  const displayContent = () => {
    if (syncRuns.length > 0) {
      return <SyncRunsTable syncRunsData={syncRuns} />;
    }
    // empty component
    return <ListEmptyComponent description={'No runs found in this sync'} />;
  };

  return (
    <>
      <PageTitle
        title={'Run History'}
        displayButton={true}
        buttonTitle={getPageButtonTitle(
          isPublicSync(getRouterPathname(query, url)),
          syncRuns,
          isQueryPending
        )}
        disabled={isQueryPending}
        onClick={toggleSyncRun}
        link={isPublicSync(getRouterPathname(query, url)) ? true : false}
        linkurl={process.env.PUBLIC_SYNC_URL}
        isFetching={isQueryPending}
        displayStartIcon={false}
      />
      <AlertComponent
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
        isError={isErrorAlert}
      />

      {/** Start Sync - Options */}

      {Boolean(anchorEl) && (
        <PopoverComponent anchorEl={anchorEl} handleClose={closePopover}>
          {displayPopoverContent()}
        </PopoverComponent>
      )}

      <CustomizedCard variant="outlined">
        {/** Displaying Errors */}
        {isError && <ErrorContainer error={error} />}
        {/** Displaying Trace Error */}
        {displayError && <ErrorStatusText>{displayError}</ErrorStatusText>}

        {isLoading && (
          <SkeletonContainer>
            <SkeletonLoader />
          </SkeletonContainer>
        )}
        {!isError && !isLoading && displayContent()}
      </CustomizedCard>
    </>
  );
};

export default SyncRuns;
