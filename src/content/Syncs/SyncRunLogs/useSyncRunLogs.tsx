/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, December 28th 2023, 12:33:10 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useLazyGetSyncRunLogsByIdQuery } from '@store/api/apiSlice';

import { sendErrorToBugsnag } from '@lib/bugsnag';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';
import { LogPayloadIn, generateLogPayload } from './SyncRunLogsUtils';

interface UseSyncRunLogProps extends LogPayloadIn {}

/**
 * Responsible for fetching the `sync run logs`.
 *
 * - Passes `data` to the `useTraceErrorCheck` hook.
 * - Responsible for sending error to `bugsnag`.
 * - returns `data`, `error`, `traceError`, `isFetching` values.
 */

export const useSyncRunLogs = (props: UseSyncRunLogProps) => {
  const { since, props: logProps } = props;

  const { syncId, runId } = logProps;

  const router = useRouter();

  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [payload, setPayload] = useState<any>(null);

  // Sync run logs query
  const [getSyncRunLogs, { data, isError, error }] =
    useLazyGetSyncRunLogsByIdQuery();

  // This useEffect will fetch logs when the router is ready and the dependencies change.
  useEffect(() => {
    if (!router.isReady) return;

    // Fetch logs using the generated payload.
    const initialPayload = generateLogPayload({
      since: since,
      props: logProps
    });
    getSyncRunLogs(payload ?? initialPayload);

    // fetchLogs({ since: since, props: logProps });
  }, [lastSync, syncId, runId, router.isReady]);

  const fetchLogs = ({ since, props }: LogPayloadIn) => {
    const payload = generateLogPayload({ since: since, props: props });
    setPayload(payload);
    setLastSync(new Date().toISOString());
  };

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data);

  if (traceError || isError) {
    // Send error to Bugsnag when a `error` is detected
    sendErrorToBugsnag(traceError || error);
  }

  return { data, traceError, error, fetchLogs };
};
