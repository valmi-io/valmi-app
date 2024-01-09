/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Events Page Component
 * This component represents a page for displaying events and creating new connection.
 */

import { ReactElement, useEffect, useState } from 'react';

import { Box, Card, Stack, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useFetch } from '@/hooks/useFetch';
import { useGetDestinationsQuery, useGetLinksQuery, useGetStreamsQuery } from '@/store/api/streamApiSlice';
import { setTrackFlowState } from '@/store/reducers/trackFlow';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import Image from 'next/image';

import Xarrow, { Xwrapper } from 'react-xarrows';

const EventsPage: NextPageWithLayout = () => {
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

  const handleCreateWarehouseOnClick = ({ edit = false, id = '' }) => {
    dispatch(setTrackFlowState({ editing: edit, id: id }));
    router.push(`${getBaseRoute(workspaceId)}/events/create`);
  };

  const [eventState, setEventState] = useState<{ isLoading: boolean; traceError: any; error: any }>({
    isLoading: false,
    traceError: null,
    error: null
  });

  const [onHoverState, setOnHoverState] = useState<{ id: string }>({ id: '' });

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

  const linkConnections = ({ links, streams, destinations }: { links: any; streams: any; destinations: any }) => {
    return getLines().map((line, idx) => (
      <LineArrow
        key={`linearrow-${line.from + line.to + idx}`}
        selected={isHighlighted(line.from, line.to)}
        from={line.from}
        to={line.to}
      />
    ));
  };

  const isHighlighted = (fromId: string, toId: string) => {
    if (!onHoverState.id) return false;
    const hoveredId = onHoverState.id;
    // get links of this id
    // highlight these links
    const linksForThisObject: any[] = [];
    for (let i = 0; i < links.ids.length; i++) {
      const link = links.entities[links.ids[i]];
      if (link.fromId === hoveredId || link.toId === hoveredId) {
        linksForThisObject.push(link);
      }
    }

    for (let i = 0; i < linksForThisObject.length; i++) {
      const link = linksForThisObject[i];
      if (link.fromId === fromId || link.toId === toId) {
        return true;
      }
    }

    return false;
  };

  const LineArrow = ({ from, to, selected = false }: { from: string; to: string; selected?: boolean }) => {
    return <Xarrow lineColor={selected ? 'red' : ''} key={`stream${from + to}`} start={from} end={to} />;
  };

  const getLines = () => {
    const lines: { from: any; to: any; selected?: boolean }[] = [];
    const logoId = 'logo';
    links.ids.forEach((linkId: string) => {
      const fromId = links.entities[linkId].fromId;
      const toId = links.entities[linkId].toId;

      const foundStream = streams.ids.some((streamId: string) => streamId === fromId);
      const foundDestination = destinations.ids.find((destinationId: string) => destinationId === toId);

      if (foundStream) {
        lines.push({
          from: fromId,
          to: logoId
        });
      }
      if (foundDestination) {
        lines.push({
          from: logoId,
          to: toId
        });
      }
    });

    return lines;
  };

  const PageContent = () => {
    if (isDataEmpty(links)) {
      return <ListEmptyComponent description={'No events found in this workspace'} />;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Xwrapper>
          <Stack spacing={2} style={{ display: 'flex', width: '100%' }}>
            {streams.ids.map((id: string) => {
              return <ConnectionItem key={`stream-${id}`} item={streams.entities[id] ?? {}} />;
            })}
          </Stack>

          <Stack
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Branding logo */}
            <Image
              // ref={logoRef}
              id="logo"
              priority={true}
              src="/images/valmi_logo_no_text.svg"
              alt="Logo"
              width={50}
              height={50}
            />
          </Stack>

          <Stack spacing={2} style={{ display: 'flex', width: '100%' }}>
            {destinations.ids.map((id: string) => {
              return <ConnectionItem key={`destination-${id}`} item={destinations.entities[id] ?? {}} />;
            })}
          </Stack>

          {/* <Xarrow /> */}
          {linkConnections({ links, destinations, streams })}
        </Xwrapper>
      </Box>
    );
  };

  const ConnectionItem = ({ item }: { item: any }) => {
    const { id = '', name = '' } = item;

    return (
      <Card
        onMouseEnter={() => {
          if (onHoverState.id !== id) {
            setOnHoverState({ id: id });
          }
        }}
        onMouseLeave={() => {
          setOnHoverState({ id: '' });
        }}
        variant="outlined"
        id={id}
        style={{
          backgroundColor: 'white',
          borderRadius: 2,
          borderColor: 'black',
          padding: 10,
          cursor: 'pointer'
        }}
      >
        <Typography>{name}</Typography>
      </Card>
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Events"
      title="Events"
      buttonTitle="Connection"
      handleButtonOnClick={() => handleCreateWarehouseOnClick({ edit: false, id: '' })}
    >
      <ContentLayout
        key={`eventsPage`}
        error={streamsError ?? destinationsError ?? linksError}
        PageContent={<PageContent />}
        displayComponent={!eventState.error && !eventState.isLoading && links}
        isLoading={eventState.isLoading}
        traceError={streamsTraceError || destinationsTraceError || linksTraceError}
      />
      {/* <ArrowExample /> */}
    </PageLayout>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default EventsPage;
