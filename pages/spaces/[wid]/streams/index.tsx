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

import { Card, Grid } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '../../../../src/components/SkeletonLoader';
import { setStreamFlowState } from '../../../../src/store/reducers/streamFlow';
import { isDataEmpty } from '../../../../src/utils/lib';
import ListEmptyComponent from '../../../../src/components/ListEmptyComponent';
import StreamsTable from '../../../../src/content/Streams/StreamsTable';
import { ErrorStatusText } from '../../../../src/components/Error';
import { useFetch } from '../../../../src/hooks/useFetch';
import { useGetStreamsQuery } from '../../../../src/store/api/streamApiSlice';

const StreamsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetStreamsQuery(workspaceId) });

  const handleButtonOnClick = ({ edit = false, streamId = '' }) => {
    dispatch(setStreamFlowState({ editing: edit, streamId: streamId }));
    router.push(`/spaces/${workspaceId}/streams/create`);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No streams found in this workspace'} />;
    }
    return <StreamsTable key={`streamstable-${workspaceId}`} data={data} handleButtonOnClick={handleButtonOnClick} />;
  };

  return (
    <PageLayout
      pageHeadTitle="Streams"
      title="Streams"
      buttonTitle="Stream"
      handleButtonOnClick={() => handleButtonOnClick({ edit: false, streamId: '' })}
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

StreamsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default StreamsPage;
