/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 7:06:28 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  Box,
  Button,
  Divider,
  Switch,
  Typography,
  styled
} from '@mui/material';

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
  fullRefresh: boolean;
  handleSwitchOnChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  startSyncRun: () => void;
  query: any;
  url: string;
  syncRuns: any;
  isQueryPending: boolean;
};

const StartSyncPopoverComponent = ({
  fullRefresh,
  handleSwitchOnChange,
  startSyncRun,
  query,
  url,
  syncRuns,
  isQueryPending
}: props) => {
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

export default StartSyncPopoverComponent;
