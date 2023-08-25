/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:47:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement } from 'react';

import { Grid } from '@mui/material';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '../../../../../../_app';

import { RootState } from '../../../../../../../src/store/reducers';
import PageLayout from '../../../../../../../src/layouts/PageLayout';
import SidebarLayout from '../../../../../../../src/layouts/SidebarLayout';
import SyncRunLogs from '../../../../../../../src/content/Syncs/SyncRunLogs';

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
