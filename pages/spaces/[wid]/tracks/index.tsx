/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Tracks Page Component
 * This component represents a page for displaying tracks and creating new track.
 */

import { ReactElement } from 'react';

import { Card, Grid, IconButton } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ErrorContainer from '@components/Error/ErrorContainer';
import { ErrorStatusText } from '@/components/Error';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useFetch } from '@/hooks/useFetch';
import { useGetLinksQuery } from '@/store/api/streamApiSlice';
import { setTrackFlowState } from '@/store/reducers/trackFlow';
import appIcons from '@/utils/icon-utils';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import CustomIcon from '@/components/Icon/CustomIcon';

const TracksPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetLinksQuery(workspaceId) });

  const handleCreateWarehouseOnClick = ({ edit = false, id = '' }) => {
    dispatch(setTrackFlowState({ editing: edit, id: id }));
    router.push(`${getBaseRoute(workspaceId)}/tracks/create`);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No tracks found in this workspace'} />;
    }
    return (
      <>
        {(data.ids as string[]).map((id) => {
          return (
            <div key={id}>
              {data.entities[id].fromId}
              <br />
              {data.entities[id].toId}
              <IconButton
                onClick={() => {
                  handleCreateWarehouseOnClick({ edit: true, id: id });
                }}
              >
                <CustomIcon icon={appIcons.EDIT} />
              </IconButton>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Tracks"
      title="Tracks"
      buttonTitle="Track"
      handleButtonOnClick={() => handleCreateWarehouseOnClick({ edit: false, id: '' })}
    >
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            {/** Display error */}
            {error && <ErrorContainer error={error} />}

            {/** Display trace error*/}
            {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

            {/** Display skeleton */}
            <SkeletonLoader loading={isLoading} />

            {/** Display page content */}
            {!error && !isLoading && data && <PageContent />}
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

TracksPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default TracksPage;
