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
import { TData } from '@/utils/typings.d';
import { redirectToCreateStream } from '@/utils/router-utils';

const StreamsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { id = '' } = router.query;

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetStreamsQuery(workspaceId) });

  const handleEditClick = ({ edit = false, streamId = '' }) => {
    dispatch(setStreamFlowState({ editing: edit, streamId: streamId }));
    redirectToCreateStream({ router: router, wid: workspaceId });
  };

  const handleLiveEventsClick = ({ streamId = '' }) => {
    const queryArgs = {
      activeView: 'incoming.all',
      viewState: {
        incoming: {
          actorId: streamId as string
        }
      }
    };

    router.push({
      pathname: `${getBaseRoute(workspaceId)}/events/live-events`,
      query: { query: JSON.stringify(queryArgs) }
    });
  };

  return (
    <PageLayout
      pageHeadTitle="Streams"
      title="STREAMS"
      buttonTitle="STREAM"
      handleButtonOnClick={() => handleEditClick({ edit: false, streamId: '' })}
    >
      <ContentLayout
        key={`streamsPage`}
        error={error}
        PageContent={
          <PageContent
            key={`streamstable-${workspaceId}`}
            id={id as string}
            data={data}
            handleEditClick={handleEditClick}
            handleLiveEventsClick={handleLiveEventsClick}
          />
        }
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

const PageContent = ({
  id,
  data,
  handleEditClick,
  handleLiveEventsClick
}: {
  id: string;
  data: TData;
  handleEditClick: any;
  handleLiveEventsClick: any;
}) => {
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No streams found in this workspace'} />;
  }
  return <StreamsTable id={id} data={data} onEditClick={handleEditClick} onLiveEventsClick={handleLiveEventsClick} />;
};
