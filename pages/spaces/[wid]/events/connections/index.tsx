/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 10th 2024, 9:42:31 am
 * Author: Nagendra S @ valmi.io
 */

/*
 * Event Connections Page Component
 * This component represents a page for displaying event Connections and creating new connection.
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import { useGetDestinationsQuery, useGetLinksQuery, useGetStreamsQuery } from '@/store/api/streamApiSlice';
import { useFetch } from '@/hooks/useFetch';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import ContentLayout from '@/layouts/ContentLayout';
import EventConnectionsTable from '@/content/Events/EventConnectionsTable';
import { setEventFlowState } from '@/store/reducers/trackFlow';
const EventConnectionsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  // getStreams
  const {
    data: streams,
    isLoading: isStreamsLoading,
    traceError: streamsTraceError,
    error: streamsError
  } = useFetch({ query: useGetStreamsQuery(workspaceId) });

  // getDestinations
  const {
    data: destinations,
    isLoading: isDestinationsLoading,
    traceError: destinationsTraceError,
    error: destinationsError
  } = useFetch({ query: useGetDestinationsQuery(workspaceId) });

  // getLinks
  const {
    data: links,
    isLoading: isLinksLoading,
    traceError: linksTraceError,
    error: linksError
  } = useFetch({ query: useGetLinksQuery(workspaceId) });

  const [eventState, setEventState] = useState<{ isLoading: boolean; traceError: any; error: any }>({
    isLoading: false,
    traceError: null,
    error: null
  });

  useEffect(() => {
    if (isStreamsLoading || isDestinationsLoading || isLinksLoading) {
      setEventState((eventState) => ({
        ...eventState,
        isLoading: true
      }));
    } else {
      setEventState((eventState) => ({
        ...eventState,
        isLoading: false
      }));
    }
  }, [isStreamsLoading, isDestinationsLoading, isLinksLoading]);

  useEffect(() => {
    if (streamsError || destinationsError || linksError) {
      setEventState((eventState) => ({
        ...eventState,
        error: streamsError || destinationsError || linksError
      }));
    }
  }, [streamsError, destinationsError, linksError]);

  useEffect(() => {
    if (streamsTraceError || destinationsTraceError || linksTraceError) {
      setEventState((eventState) => ({
        ...eventState,
        traceError: streamsTraceError || destinationsTraceError || linksTraceError
      }));
    }
  }, [streamsTraceError, destinationsTraceError, linksTraceError]);

  const handleButtonOnClick = ({ edit = false, id = '' }) => {
    dispatch(setEventFlowState({ editing: edit, id: id }));
    router.push(`${getBaseRoute(workspaceId)}/events/create`);
  };

  const PageContent = () => {
    if (isDataEmpty(links)) {
      return <ListEmptyComponent description={'No events found in this workspace'} />;
    }

    return (
      <EventConnectionsTable
        key={`eventConnectionsTable-${workspaceId}`}
        data={links}
        streams={streams}
        destinations={destinations}
        handleButtonOnClick={handleButtonOnClick}
      />
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Connections"
      title="Connections"
      buttonTitle="Connection"
      handleButtonOnClick={() => handleButtonOnClick({ edit: false, id: '' })}
    >
      <ContentLayout
        key={`eventConnectionsPage`}
        error={streamsError ?? destinationsError ?? linksError}
        PageContent={<PageContent />}
        displayComponent={!eventState.error && !eventState.isLoading && links}
        isLoading={eventState.isLoading}
        traceError={streamsTraceError || destinationsTraceError || linksTraceError}
      />
    </PageLayout>
  );
};

EventConnectionsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default EventConnectionsPage;
