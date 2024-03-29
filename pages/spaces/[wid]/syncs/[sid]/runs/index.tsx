/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';
import PageLayout from '@layouts/PageLayout';

import SyncRuns from '@content/Syncs/SyncRuns';
import SyncDetails from '@content/Syncs/SyncDetails';

import { RootState } from '@store/reducers';

const SyncRunsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { sid = '1' } = router.query;
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  return (
    <PageLayout
      pageHeadTitle="Sync Runs"
      title={'Sync Details'}
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
          <SyncDetails syncId={sid} workspaceId={workspaceId} />
        </Grid>
        <Grid item xs={12}>
          <SyncRuns syncId={sid} workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

SyncRunsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncRunsPage;
