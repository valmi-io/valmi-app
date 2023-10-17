/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 7:06:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Button, Divider, Typography, styled } from '@mui/material';

import { getRouterPathname, isPublicSync } from '@utils/routes';

import { getPageButtonTitle } from '@content/Syncs/SyncRuns/SyncRunsUtils';

const StartSyncOptionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.alpha.black[5],
  padding: theme.spacing(2)
}));

type props = {
  stopSyncRun: () => void;
  closePopover: () => void;
  query: any;
  url: string;
  syncRuns: any;
  isQueryPending: boolean;
};

const StopSyncPopoverComponent = ({
  closePopover,
  stopSyncRun,
  query,
  url,
  syncRuns,
  isQueryPending
}: props) => {
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

export default StopSyncPopoverComponent;
