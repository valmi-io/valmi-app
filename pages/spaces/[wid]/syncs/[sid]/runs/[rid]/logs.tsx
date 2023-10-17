/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:47:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import SyncRunLogs from '@content/Syncs/SyncRunLogs';

import { RootState } from '@store/reducers';

const SyncRunLogsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { rid = '1', sid = '1', connection_type = '' } = router.query as any;
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  return (
    <PageLayout
      pageHeadTitle={
        connection_type === 'src'
          ? 'Source Log History'
          : 'Destination Log History'
      }
      title={
        connection_type === 'src'
          ? 'Source Log History'
          : 'Destination Log History'
      }
      displayButton={false}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <SyncRunLogs
            syncId={sid}
            runId={rid}
            connectionType={connection_type}
            workspaceId={workspaceId}
          />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

SyncRunLogsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncRunLogsPage;
