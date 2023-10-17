/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * SyncsPage Component
 * This component represents a page for displaying syncs and creating new syncs.
 */

import { ReactElement, useEffect } from 'react';

import { Grid } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import Syncs from '@content/Syncs/SyncsPage';
import { initialiseFlowState } from '@content/SyncFlow/stateManagement';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';

const SyncsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const { workspaceId = '' } = appState;

  const handleCreateSyncOnClick = () => {
    router.push(`/spaces/${workspaceId}/syncs/create`);
  };

  useEffect(() => {
    // initialising sync flow state
    initialiseFlowState(dispatch, flowState, false);
  }, []);

  return (
    <PageLayout
      pageHeadTitle="Syncs"
      title="Syncs"
      buttonTitle="Sync"
      handleButtonOnClick={handleCreateSyncOnClick}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          {/* Embed the Syncs component to display sync data */}
          <Syncs workspaceId={workspaceId} />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

SyncsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncsPage;
