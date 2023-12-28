/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 6:57:38 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Tracks Page Component
 * This component represents a page for displaying tracks and creating new tracks.
 */

import { ReactElement } from 'react';

import { Grid } from '@mui/material';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';

const TracksPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const handleCreateLinkOnClick = () => {
    router.push(`/spaces/${workspaceId}/tracks/create`);
  };

  return (
    <PageLayout
      pageHeadTitle="Tracks"
      title="Tracks"
      buttonTitle="Track"
      handleButtonOnClick={handleCreateLinkOnClick}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          {/* Embed the Tracks component to display track data */}
        </Grid>
      </Grid>
    </PageLayout>
  );
};

TracksPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default TracksPage;
