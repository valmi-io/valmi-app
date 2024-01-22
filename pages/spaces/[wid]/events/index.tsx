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

import { Box, Card, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useFetch } from '@/hooks/useFetch';
import { useGetDestinationsQuery, useGetLinksQuery, useGetStreamsQuery } from '@/store/api/streamApiSlice';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import Image from 'next/image';

import Xarrow, { Xwrapper } from 'react-xarrows';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { AppState } from '@/store/store';
import { extStreams } from '@/constants/extDestinations';

type EventConnectionType = 'STREAM' | 'DESTINATION';

const EventsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const theme = useTheme();

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

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
    return (
      <Xarrow
        showHead={false}
        lineColor={selected ? theme.colors.primary.main : theme.colors.primary.lighter}
        strokeWidth={5}
        key={`stream${from + to}`}
        start={from}
        end={to}
      />
    );
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

  const handleLogoOnClick = () => {
    router.push(`${getBaseRoute(workspaceId)}/events/connections`);
  };

  const handleConnectionOnClick = ({ connectionType, id }: { connectionType: EventConnectionType; id: string }) => {
    if (connectionType === 'STREAM') {
      router.push(`${getBaseRoute(workspaceId)}/streams?id=${id}`);
    } else if (connectionType === 'DESTINATION') {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses?id=${id}`);
    }
  };

  const PageContent = () => {
    if (isDataEmpty(links)) {
      let description = '';

      let connectionType = '';

      if (!streams || streams.ids?.length === 0) {
        description = 'Create your first stream';
        connectionType = 'STREAM';
      } else if (!destinations || destinations.ids?.length === 0) {
        connectionType = 'DESTINATION';
        description = 'Create your first warehouse';
      }

      const handleOnClick = () => {
        if (connectionType === 'STREAM') {
          router.push(`${getBaseRoute(workspaceId)}/streams`);
        } else if (connectionType === 'DESTINATION') {
          router.push(`${getBaseRoute(workspaceId)}/destination-warehouses`);
        }
      };

      return <ListEmptyComponent description={description} onClick={handleOnClick} buttonTitle={connectionType} />;
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
          <Stack spacing={2} sx={{ display: 'flex', width: '100%', mt: 1 }}>
            <Typography variant="body1">{'Streams'}</Typography>
            {streams.ids.map((id: string) => {
              return <ConnectionItem key={`stream-${id}`} item={streams.entities[id] ?? {}} connectionType="STREAM" />;
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

            <Tooltip title="connections">
              <Image
                id="logo"
                priority={true}
                src="/images/valmi_logo_no_text.svg"
                alt="Logo"
                width={60}
                height={60}
                onClick={handleLogoOnClick}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </Stack>

          <Stack spacing={2} sx={{ display: 'flex', width: '100%', mt: 1 }}>
            <Typography variant="body1">{'Destinations'}</Typography>
            {destinations.ids.map((id: string) => {
              return (
                <ConnectionItem
                  key={`destination-${id}`}
                  item={destinations.entities[id] ?? {}}
                  connectionType="DESTINATION"
                />
              );
            })}
          </Stack>

          {/* <Xarrow /> */}
          {linkConnections({ links, destinations, streams })}
        </Xwrapper>
      </Box>
    );
  };

  const ConnectionItem = ({ item, connectionType }: { item: any; connectionType: EventConnectionType }) => {
    const { id = '', name = '', destinationType = '', type = '' } = item;

    const connectortype = connectionType === 'STREAM' ? extStreams.browser.type : destinationType;

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
        sx={{
          pl: 2,
          borderWidth: onHoverState.id === id ? 2 : 0.5,
          borderColor: (theme) => (onHoverState.id === id ? theme.colors.primary.main : theme.palette.divider)
        }}
        style={{
          borderRadius: 5,
          display: 'flex',
          height: 62,
          cursor: 'pointer',
          alignItems: 'center'
        }}
        onClick={() => handleConnectionOnClick({ connectionType, id })}
      >
        <ImageComponent
          title={name}
          src={`/connectors/${connectortype.toLowerCase()}.svg`}
          size={ImageSize.small}
          alt={`connectionIcon`}
          style={{ marginRight: '10px' }}
        />
      </Card>
    );
  };

  return (
    <PageLayout pageHeadTitle="Events" title="Events" buttonTitle="Connection" displayButton={false}>
      <ContentLayout
        key={`eventsPage`}
        error={streamsError ?? destinationsError ?? linksError}
        PageContent={<PageContent />}
        displayComponent={!eventState.error && !eventState.isLoading && links}
        isLoading={eventState.isLoading}
        traceError={streamsTraceError || destinationsTraceError || linksTraceError}
        cardVariant={links?.ids?.length <= 0 ? true : false}
      />
    </PageLayout>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default EventsPage;
