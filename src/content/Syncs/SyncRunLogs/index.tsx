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

import SkeletonLoader from '@components/SkeletonLoader';
import ErrorContainer from '@components/Error/ErrorContainer';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import { ErrorStatusText } from '@components/Error';
import ListEmptyComponent from '@components/ListEmptyComponent';

import { useLazyGetSyncRunLogsByIdQuery } from '@store/api/apiSlice';

import { isObjectEmpty } from '@utils/lib';

import { sendErrorToBugsnag } from '@lib/bugsnag';
import SyncRunLogFooter from './SyncRunLogFooter';

const CustomizedCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4)
}));

/**
 * Responsible for rendering the logs page and its components.
 *
 * - Queries for `syncRunLogs`.
 * - Passes `syncRunLogs` prop to the `SyncRunLogsTable` component.
 * - Passes `fetch, isFetching` props to the `SyncRunLogFooter` component
 *  and responsible for handling `handleFetchMore` function.
 * - Passes `error` prop to the  `ErrorContainer` component.
 * - Passes `traceError` prop to the `ErrorStatusText` component
 * - Responsible for rendering `ListEmptyComponent` when `logs` are empty.
 */

const SyncRunLogs = (props: SyncRunLogProps) => {
  const { runId, syncId } = props;
  const router = useRouter();

  // Sync run logs query
  const [getSyncRunLogs, { data, isError, error, isFetching }] =
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
    const payload = generatePayload({ since: -1, props: props });

    if (!fetch) return;

    if (messages.length < 1) {
      setIsLoading(true);
    }

    // Fetch logs using the generated payload.
    fetchLogs(logPayload ?? payload);
  }, [fetch, syncId, runId, router.isReady]);

  // This useEffect will check for traces and updateLogData.
  useEffect(() => {
    if (data) {
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
      // Send error to bugsnag
      sendErrorToBugsnag(error);

      setIsLoading(false);
      setFetch(false);
    }
  }, [isError]);

  /**
   * Fetch logs using payload.
   * @param payload
   */
  const fetchLogs = (payload: any) => {
    getSyncRunLogs(payload);
  };

  /**
   * Checks if since exists in SincesArray
   * @param sincesArray
   * @param since
   * @returns true | false
   */
  const isSinceExistsInArray = (sincesArray: any, since: any): boolean => {
    return sincesArray.indexOf(since) === -1 ? false : true;
  };

  /**
   * Handles log data.
   * Updates Sinces array and Logs object based on data.
   * @param logData
   */
  const handleLogData = (logData: any) => {
    const { meta = {}, logs = [] } = logData ?? {};
    const { since, before } = meta;

    if (!since) {
      // Generate the new payload with updated since property.
      // If before is null, since = -1
      const payload = generatePayload({
        since: before ?? -1,
        props: props
      });

      // Update logPayload state with the new generated payload
      setLogPayload(payload);

      // Update fetch state to true
      setFetch(true);
    } else {
      // Append since, if not existed in existing sinces array.
      if (!isSinceExistsInArray(sinces, since)) {
        setSinces((prevSinces) => [...prevSinces, since]);
      }

      // Generate the logs object.
      const generatedLogsObject = generateLogsObject(since, logs);

      // Update the setLogs state with the new generatedLogs.
      setLogs((prevLogs) => ({
        ...prevLogs,
        ...generatedLogsObject
      }));
    }
  };

  /**
   *  Handles fetching more logs when a button is clicked.
   *  @param logData
   */
  const handleFetchMore = (logData: any) => {
    const { meta = {} } = logData;
    const { since, before } = meta;

    let sinceVal = since;
    if (before) {
      sinceVal = before;
    }

    // Generate the new payload with updated since.
    const payload = generatePayload({ since: sinceVal, props: props });
    setLogPayload(payload);
    setFetch(true);
  };

  /**
   * Responsible for displaying Logs Table and Logs Footer.
   * @returns Logs, Footer and Empty Component based on data.
   */
  const displayPageContent = () => {
    if (messages.length > 0) {
      return (
        <>
          <SyncRunLogsTable syncRunLogs={messages} />
          <SyncRunLogFooter
            fetch={fetch}
            isFetching={isFetching}
            onClick={() => handleFetchMore(logData)}
          />
        </>
      );
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
      <SkeletonLoader loading={isLoading} />

      {/** Display Content */}
      {!isError && !isLoading && data && displayPageContent()}
    </CustomizedCard>
  );
};

export default SyncRunLogs;
