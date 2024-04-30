/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 1:33:54 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Live Events Page Component
 * This component represents a page for displaying live events.
 */

import { ChangeEvent, useEffect, useState } from 'react';

import { useLazyGetConnectionLogsQuery, useLazyGetStreamLogsQuery } from '@/store/api/streamApiSlice';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { copy, getBaseRoute } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import Modal from '@/components/Modal';
import IncomingEventsTable from '@/content/Events/LiveEvents/IncomingEventsTable';
import BulkerEventsTable from '@/content/Events/LiveEvents/BulkerEventsTable';
import EventsFooter from '@/content/Events/LiveEvents/EventsFooter';
import TextFieldDropdown from '@/components/SelectDropdown/TextFieldDropdown';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { getErrorsInData, hasErrorsInData } from '@/components/Error/ErrorUtils';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

type EventTypes = 'incoming.all' | 'bulker_batch.all';

type DropdownState = {
  streamId: string;
  connectionId: string;
  data: [];
};

const LiveEvents = ({
  type,
  actorId
}: {
  type: string | string[] | undefined;
  actorId: string | string[] | undefined;
}) => {
  const router = useRouter();

  const { query } = router.query;

  const { workspaceId = null } = useWorkspaceId();

  const [
    getStreamLogs,
    {
      data: streamLogsData,
      currentData: streamCurrentData,
      isLoading: isStreamLogsLoading,
      isFetching: isStreamLogsFetching,
      error: streamLogsError
    }
  ] = useLazyGetStreamLogsQuery();

  const [
    getConnectionLogs,
    { data: connLogsData, isLoading: isconnLogsLoading, isFetching: isconnLogsFetching, error: connLogsError }
  ] = useLazyGetConnectionLogsQuery();

  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const [eventState, setEventState] = useState<{ isLoading: boolean; traceError: any; error: any }>({
    isLoading: false,
    traceError: null,
    error: null
  });

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    streamId: '',
    connectionId: '',
    data: []
  });

  useEffect(() => {
    fetchLogs();
  }, [type, actorId]);

  const fetchLogs = () => {
    if (type === 'incoming.all') {
      getStreamLogs({ workspaceId, eventType: type, actorId });
    } else if (type === 'bulker_batch.all') {
      getConnectionLogs({ workspaceId, eventType: type, actorId });
    }
  };

  useEffect(() => {
    if (streamLogsData || connLogsData) {
      const interval = 10000; // in milliseconds

      const runInterval = setInterval(fetchLogs, interval);
      return () => {
        clearInterval(runInterval);
      };
    }
  }, [streamLogsData, connLogsData]);

  useEffect(() => {
    if (isStreamLogsLoading || isconnLogsLoading) {
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
  }, [isStreamLogsLoading, isconnLogsLoading]);

  useEffect(() => {
    if (streamLogsError || connLogsError) {
      setEventState((eventState) => ({
        ...eventState,
        error: streamLogsError || connLogsError
      }));
    }
  }, [streamLogsError, connLogsError]);

  useEffect(() => {
    if (streamLogsData && hasErrorsInData(streamLogsData)) {
      const traceError = getErrorsInData(streamLogsData);

      setEventState((eventState) => ({
        ...eventState,
        error: traceError
      }));
    } else {
      if (streamLogsData?.streams) {
        setDropdownState((state) => ({
          ...state,
          //@ts-ignore
          data: streamLogsData?.streams?.objects ?? [],
          streamId: actorId as string
        }));
      }
    }
  }, [streamLogsData]);

  useEffect(() => {
    if (connLogsData) {
      if (hasErrorsInData(connLogsData)) {
        const traceError = getErrorsInData(connLogsData);

        setEventState((eventState) => ({
          ...eventState,
          error: traceError
        }));
      } else {
        const connections = getConnections(connLogsData);

        setDropdownState((state) => ({
          ...state,
          data: connections,
          connectionId: actorId as string
        }));
      }
    }
  }, [connLogsData]);

  const handleRowOnClick = ({ data }: any) => {
    setSelectedRowData(processedLogData(data));
    setCopied(false);
    setDialogOpen(true);
  };

  const processedLogData = (data: any) => {
    if (type === 'bulker_batch.all') {
      return JSON.parse(data);
    }
    let ev = JSON.parse(data);

    let ingestPayload: any = {};
    let unparsedPayload = '';
    if (typeof ev.content.body === 'string') {
      unparsedPayload = ev.content.body;
      try {
        ingestPayload = JSON.parse(ev.content.body);
      } catch (e) {
        console.error(ev.content.body, e);
      }
    }

    const event = ingestPayload.httpPayload;
    const context = event?.context;

    return {
      id: ev.id,
      date: ev.date,
      type: ingestPayload.type,
      email: context?.traits?.email || event?.traits?.email,
      userId: event?.userId,
      ingestType: ingestPayload.ingestType,
      host: context?.page?.host,
      messageId: ingestPayload.messageId,
      originDomain: ingestPayload.origin?.domain || '',
      writeKey: ingestPayload.writeKey,
      event: event.event ?? '',
      status: ev.content.status,
      error: ev.content.error,
      pageURL: context?.page?.url,
      pagePath: context?.page?.path,
      pageTitle: context?.page?.title,
      anonymousId: event?.anonymousId,
      destinations: [...(ev.content.asyncDestinations ?? []), ...(ev.content.tags ?? [])],
      referringDomain: context?.page?.referring_domain,
      httpHeaders: ingestPayload.httpHeaders,
      ingestPayload: ingestPayload,
      context: context
    };
  };

  const handleCopyToClipboard = () => {
    if (selectedRowData) {
      setCopied(true);
      copy(selectedRowData);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>, type: EventTypes) => {
    let queryState = JSON.parse(query as string);

    let key = '';
    if (type === 'incoming.all') {
      key = 'streamId';
      queryState = {
        ...queryState,
        viewState: {
          ...queryState.viewState,
          incoming: {
            actorId: e.target.value
          }
        }
      };
    } else if (type === 'bulker_batch.all') {
      key = 'connectionId';

      queryState = {
        ...queryState,
        viewState: {
          ...queryState.viewState,
          bulker: {
            actorId: e.target.value
          }
        }
      };
    }

    setDropdownState((state) => ({
      ...state,
      [key]: e.target.value
    }));

    queryState['activeView'] = type;

    handleNavigation({ state: queryState });
  };

  const handleNavigation = ({ state }: { state: any }) => {
    router.push(
      {
        pathname: `${getBaseRoute(workspaceId)}/events/live-events`,
        query: { query: JSON.stringify(state) }
      },
      undefined,
      { shallow: true }
    );
  };

  const PageContent = () => {
    if (type === 'incoming.all') {
      return (
        <>
          {streamLogsData?.logs &&
            //@ts-ignore
            (streamLogsData?.logs.length <= 0 ? (
              <ListEmptyComponent description={'No data.'} />
            ) : (
              <>
                <IncomingEventsTable
                  key={`incomingEventsTable-${actorId}`}
                  data={streamLogsData?.logs ?? []}
                  onRowClick={handleRowOnClick}
                />

                <EventsFooter isFetching={isStreamLogsFetching} />
              </>
            ))}
        </>
      );
    } else if (type === 'bulker_batch.all') {
      //@ts-ignore
      if (connLogsData?.logs?.length <= 0) {
        return <ListEmptyComponent description={'No data.'} />;
      }
      return (
        <>
          <BulkerEventsTable
            key={`bulkerEventsTable-${actorId}`}
            data={connLogsData?.logs ?? []}
            onRowClick={handleRowOnClick}
          />

          <EventsFooter isFetching={isconnLogsFetching} />
        </>
      );
    }

    return null;
  };

  const shouldDisplayContent = () => {
    const { error, isLoading } = eventState;
    const { logs } = streamLogsData ?? {};

    const { logs: connLogs } = connLogsData ?? {};

    if (!error && !isLoading && (logs || connLogs)) return true;

    return false;
  };

  return (
    <>
      <Stack
        sx={{
          maxWidth: 500,
          display: 'flex',
          flexDirection: 'row',
          gap: 0.5,
          alignItems: 'center',
          my: 2
        }}
      >
        <Typography>{getDropdownTitle(type as EventTypes)}</Typography>
        <TextFieldDropdown
          key={getDropdownUniqueKey(type as EventTypes)}
          label={''}
          required={true}
          fullWidth
          disabled={false}
          value={getDropdownValues(type as EventTypes, dropdownState, actorId as string)}
          onChange={(e) => handleOnChange(e, type as EventTypes)}
          primaryKey="name"
          valueKey="id"
          data={dropdownState.data}
        />
      </Stack>
      <ContentLayout
        key={`liveEventsPage-${workspaceId}-${type}`}
        error={streamLogsError || connLogsError}
        PageContent={<PageContent />}
        displayComponent={shouldDisplayContent()}
        isLoading={eventState.isLoading}
        traceError={false}
      />
      <Modal
        title="Event Details"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        handleCopy={handleCopyToClipboard}
        data={selectedRowData}
        copy={true}
        isCopied={copied}
      />
    </>
  );
};

export default LiveEvents;

const getDropdownUniqueKey = (type: EventTypes) => {
  return type === 'incoming.all' ? `streamDropdown` : `connectionDropdown`;
};

const getDropdownTitle = (type: EventTypes) => {
  return type === 'incoming.all' ? `Streams:` : `Connections:`;
};

const getDropdownValues = (type: EventTypes, state: DropdownState, actorId: string) => {
  return type === 'incoming.all' ? state.streamId : state.connectionId;
};

const getConnectionObj = ({ id = '', data = [] }: { id: string; data: any[] }) => {
  const obj = data.find((item: any) => {
    return item.id === id;
  });

  return obj ?? {};
};

const getConnections = ({ streams, destinations, links }: any) => {
  const result = links.links.map((item: any) => {
    return {
      id: item.id,
      name: `${getConnectionObj({ id: item.fromId, data: streams.objects }).name} - ${
        getConnectionObj({
          id: item.toId,
          data: destinations.objects
        }).name
      }`
    };
  });
  return result;
};
