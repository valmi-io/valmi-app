/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, November 9th 2023, 4:58:07 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useLazyGetSyncRunsByIdQuery } from '@store/api/apiSlice';

import { sendErrorToBugsnag } from '@lib/bugsnag';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';
import { getRouterPathname, isPublicSync } from '../../../utils/routes';

interface UseSyncRunProps {
  syncId: string;
  workspaceId: string;
}

/**
 * Responsible for fetching the `sync runs`.
 *
 * - Responsible for taking `workspaceId` prop.
 * - Passes `data` to the `useTraceErrorCheck` hook.
 * - Responsible for sending error to `bugsnag`.
 * - returns `data`, `error`, `traceError`, `isFetching` values.
 */

export const useSyncRuns = ({ syncId, workspaceId }: UseSyncRunProps) => {
  const router = useRouter();
  const url = router.pathname;
  const query = router.query;

  const [getSyncRuns, { data, isLoading, isError, error }] =
    useLazyGetSyncRunsByIdQuery();

  // sync run states
  const [lastSync, setLastSync] = useState(new Date().toISOString());

  useEffect(() => {
    if (!router.isReady) return;
    const fetchSyncRuns = () => {
      const publicWorkspaceId = process.env.PUBLIC_WORKSPACE;
      const publicSyncId = process.env.PUBLIC_SYNC;

      // extracting workspace id and syncid from router.pathname
      const pathname = getRouterPathname(query, url);

      const payload = {
        syncId: isPublicSync(pathname) ? publicSyncId : syncId,
        workspaceId: isPublicSync(pathname) ? publicWorkspaceId : workspaceId,
        before: lastSync,
        limit: 25
      };

      getSyncRuns(payload);
    };
    fetchSyncRuns();
  }, [lastSync, syncId, router.isReady]);

  const updateLastSync = () => {
    setLastSync(new Date().toISOString());
  };

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data);

  if (traceError || isError) {
    // Send error to Bugsnag when a `error` is detected
    sendErrorToBugsnag(traceError || error);
  }

  return { data, isLoading, traceError, error, updateLastSync };
};
