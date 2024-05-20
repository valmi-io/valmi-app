/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';
import PageLayout from '@layouts/PageLayout';

import SyncRuns from '@content/Syncs/SyncRuns';
import SyncDetails from '@content/Syncs/SyncDetails';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const SyncRunsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { cid = '1' } = router.query;

  const { workspaceId = null } = useWorkspaceId();

  return (
    <PageLayout pageHeadTitle="Sync Runs" title={'Sync Details'} displayButtonInHeader={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <SyncDetails syncId={cid} workspaceId={workspaceId} />
        </Grid>
        <Grid item xs={12}>
          <SyncRuns syncId={cid} workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

SyncRunsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncRunsPage;
