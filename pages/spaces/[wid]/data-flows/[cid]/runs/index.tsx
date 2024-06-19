import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';
import PageLayout from '@layouts/PageLayout';

import SyncRuns from '@content/Syncs/SyncRuns';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import DataflowDetails from '@/content/DataFlowDetails/DataFlowDetails';

const SyncRunsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { cid = '1' } = router.query;

  const { workspaceId = '' } = useWorkspaceId();

  return (
    <PageLayout pageHeadTitle="Runs" title={'FLOW DETAILS'} displayButton={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <DataflowDetails syncId={cid as string} />
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
