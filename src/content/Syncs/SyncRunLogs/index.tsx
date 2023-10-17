/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:53:10 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, styled } from '@mui/material';

import SyncRunLogsTable from '@content/Syncs/SyncRunLogs/SyncRunLogsTable';
import {
  generateLogsObject,
  generateLogMessages,
  generatePayload,
  LogsType,
  SyncRunLogProps
} from '@content/Syncs/SyncRunLogs/SyncRunLogsUtils';

import { SkeletonContainer } from '@components/Layouts/Layouts';
import SkeletonLoader from '@components/SkeletonLoader';
import ErrorContainer from '@components/Error/ErrorContainer';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import { ErrorStatusText } from '@components/Error';
import ListEmptyComponent from '@components/ListEmptyComponent';

import { useLazyGetSyncRunLogsByIdQuery } from '@store/api/apiSlice';

import { isObjectEmpty } from '@utils/lib';

import { sendErrorToBugsnag } from '@lib/bugsnag';

const CustomizedCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4)
}));

const SyncRunLogs = (props: SyncRunLogProps) => {
  const router = useRouter();

  // Sync run logs query
  const [getSyncRunLogs, { data, isError, error }] =
    useLazyGetSyncRunLogsByIdQuery();

  const [traceError, setTraceError] = useState<any>(null);

  const [sinces, setSinces] = useState<string[]>([]);

  const [logs, setLogs] = useState<LogsType>({});

  const [messages, setMessages] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [logData, setLogData] = useState<any>(null);

  const [logPayload, setLogPayload] = useState<any>(null);

  const [fetch, setFetch] = useState<boolean>(true);

  // This useEffect will fetch logs when the router is ready and the dependencies change.
  useEffect(() => {
    if (!router.isReady) return;

    // Generate the initial payload for fetching logs.
    let payload = generatePayload({ since: -1, props: props });

    if (!fetch) return;

    if (messages.length < 1) {
      setIsLoading(true);
    }

    // Fetch logs using the generated payload.
    getSyncRunLogs(logPayload ? logPayload : payload);
  }, [fetch, props.syncId, props.runId, router.isReady]);

  // This useEffect will handle data
  useEffect(() => {
    if (data) {
      // console.log('Logs data', data);
      // Fetch trace errors in the data.
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);

        // Send error to bugsnag
        sendErrorToBugsnag(traceError);
        setTraceError(traceError);
      } else {
        setFetch(false);
        setLogData(data);
      }
    }
  }, [data]);

  // This useEffect will handle data
  useEffect(() => {
    if (logData) {
      handleLogData(logData);
    }
  }, [logData]);

  // This useEffect will generate log messages.
  useEffect(() => {
    if (!isObjectEmpty(logs)) {
      // Generate log messages for display.
      const messages = generateLogMessages(sinces, logs);
      setMessages(messages);
      setIsLoading(false);
    }
  }, [logs]);

  // This useEffect will handle errors.
  useEffect(() => {
    if (isError) {
      //console.log('Logs: error', error);
      // Send error to bugsnag
      sendErrorToBugsnag(error);

      setIsLoading(false);
      setFetch(false);
    }
  }, [isError]);

  const handleLogData = (logData: any) => {
    // console.log('trying to handle log data', logData);
    const { meta = {} } = logData;
    const { since, before } = meta;

    let payload = null;

    // If since does not exists
    if (!since) {
      // If before does not exists, fetch logs using the initial payload.
      if (!before) return;

      // Generate the new payload with updated since.
      payload = generatePayload({
        since: before,
        props: props
      });
    } else {
      // If since exists.

      // Update setSinces state with the new since value.
      setSinces((prevSinces) => [...prevSinces, since]);

      // Update the setLogs state with the new generatedLogs.
      const { logs = {} } = data;

      // Generate the logs object.
      const generatedLogsObject = generateLogsObject(since, logs);

      setLogs((prevLogs) => ({
        ...prevLogs,
        ...generatedLogsObject
      }));

      // Generate the new payload
      let sinceVal = since;
      if (before) {
        sinceVal = before;
      }

      // Generate the new payload with updated since.
      payload = generatePayload({ since: sinceVal, props: props });
    }

    // Update setLogPayload state with the new payload.
    setLogPayload(payload);
    setFetch(true);
  };

  // Page content
  const displayContent = () => {
    if (messages.length > 0) {
      // Display Syncrunlogs table.
      return <SyncRunLogsTable syncRunLogs={messages} />;
    }

    // Display empty component
    return <ListEmptyComponent description={'No logs found in this run'} />;
  };

  return (
    <CustomizedCard variant="outlined">
      {/** Display Errors */}
      {isError && <ErrorContainer error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      {isLoading && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}

      {/** Display Content */}
      {!isError && !isLoading && data && displayContent()}
    </CustomizedCard>
  );
};

export default SyncRunLogs;
