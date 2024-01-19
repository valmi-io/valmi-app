/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Streams Page Component
 * This component represents a page for displaying streams and creating new stream.
 */

import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { RootState } from '@store/reducers';
import { useGetStreamsQuery } from '@/store/api/streamApiSlice';
import { useFetch } from '@/hooks/useFetch';
import { setStreamFlowState } from '@/store/reducers/streamFlow';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import StreamsTable from '@/content/Streams/StreamsTable';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { AppState } from '@/store/store';

const StreamsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { id = '' } = router.query;

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetStreamsQuery(workspaceId) });

  const handleEditClick = ({ edit = false, streamId = '' }) => {
    dispatch(setStreamFlowState({ editing: edit, streamId: streamId }));
    router.push(`${getBaseRoute(workspaceId)}/streams/create`);
  };

  const handleLiveEventsClick = ({ streamId = '' }) => {
    router.push(`${getBaseRoute(workspaceId)}/events/live-events?id=${streamId}&type=incoming.all`);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No streams found in this workspace'} />;
    }
    return (
      <StreamsTable
        key={`streamstable-${workspaceId}`}
        id={id}
        data={data}
        onEditClick={handleEditClick}
        onLiveEventsClick={handleLiveEventsClick}
      />
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Streams"
      title="Streams"
      buttonTitle="Stream"
      handleButtonOnClick={() => handleEditClick({ edit: false, streamId: '' })}
    >
      <ContentLayout
        key={`streamsPage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

StreamsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default StreamsPage;
