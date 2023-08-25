/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:53:10 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, styled } from '@mui/material';

import SyncRunLogsTable from './SyncRunLogsTable';
import { useLazyGetSyncRunLogsByIdQuery } from '../../../store/api/apiSlice';
import {
  generateLogsObject,
  generateLogMessages,
  generatePayload,
  LogPayload,
  LogsType,
  SyncRunLogProps
} from './SyncRunLogsUtils';
import { SkeletonContainer } from '../../../components/Layouts/Layouts';
import SkeletonLoader from '../../../components/SkeletonLoader';
import ErrorContainer from '../../../components/Error/ErrorContainer';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../../components/Error/ErrorUtils';
import { ErrorStatusText } from '../../../components/Error';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import { isObjectEmpty } from '../../../utils/lib';
import { sendErrorToBugsnag } from '../../../lib/bugsnag';

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

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // This useEffect will fetch logs when the router is ready and the dependencies change.
  useEffect(() => {
    if (!router.isReady) return;

    // Generate the initial payload for fetching logs.
    const payload = generatePayload({ since: -1, props: props });

    // Fetch logs using the generated payload.
    fetchLogs(payload);
  }, [props.syncId, props.runId, router.isReady]);

  // This useEffect will handle data
  useEffect(() => {
    if (data) {
      // Fetch trace errors in the data.
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);

        // Send error to bugsnag
        sendErrorToBugsnag(traceError);
        setTraceError(traceError);
      } else {
        const { meta } = data;
        const { since, before } = meta;

        // Fetch logs if since does not exist.
        if (!since) {
          // Generate the payload for fetching logs.
          const payload = generatePayload({
            since: before ? before : -1,
            props: props
          });

          // Fetch logs using the generated payload.
          fetchLogs(payload);

          return;
        } else {
          const { logs } = data;

          setSinces((prevSinces) => [...prevSinces, since]);

          // Generate the logs object.
          const generatedLogsObject = generateLogsObject(since, logs);

          setLogs((prevLogs) => ({
            ...prevLogs,
            ...generatedLogsObject
          }));

          let sinceVal = since;
          if (before) {
            sinceVal = before;
          }

          // Generate the payload for fetching logs.
          const payload = generatePayload({ since: sinceVal, props: props });

          // Fetch logs using the generated payload.
          fetchLogs(payload);
        }
      }
    }
  }, [data]);

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
      // Send error to bugsnag
      sendErrorToBugsnag(error);

      setIsLoading(false);
    }
  }, [isError]);

  // This function will invoke syncrunlogs query with the generated payload.
  const fetchLogs = (payload: LogPayload) => {
    setIsLoading(true);
    getSyncRunLogs(payload);
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
