/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Streams Page Component
 * This component represents a page for displaying streams and creating new stream.
 */

import { ReactElement, useEffect } from 'react';

import { Card, Grid, IconButton } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import { useGetStreamsQuery } from '@store/api/streamApiSlice';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '../../../../src/components/SkeletonLoader';
import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';
import appIcons from '../../../../src/utils/icon-utils';
import { setStreamFlowState } from '../../../../src/store/reducers/streamFlow';

const StreamsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const handleCreateStreamOnClick = ({ edit = false, streamId = '' }) => {
    dispatch(setStreamFlowState({ editing: edit, streamId: streamId }));
    router.push(`/spaces/${workspaceId}/streams/create`);
  };

  const { data, isLoading, isSuccess, isError, error } = useGetStreamsQuery(workspaceId);

  const PageContent = () => {
    return (
      <>
        {(data.ids as string[]).map((id) => {
          return (
            <div key={id}>
              {data.entities[id].name}
              <IconButton
                onClick={() => {
                  handleCreateStreamOnClick({ edit: true, streamId: id });
                }}
              >
                <FontAwesomeIcon icon={appIcons.EDIT} />
              </IconButton>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <PageLayout pageHeadTitle="Streams" title="Streams" buttonTitle="Stream" handleButtonOnClick={handleCreateStreamOnClick}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          {/* Embed the Tracks component to display track data */}

          <Card variant="outlined">
            {/** Display error */}
            {isError && <ErrorContainer error={error} />}

            {/** Display trace error
              {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}*/}

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

StreamsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default StreamsPage;
