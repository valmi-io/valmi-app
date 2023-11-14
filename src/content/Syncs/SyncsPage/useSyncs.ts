/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, October 17th 2023, 2:01:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { useFetchSyncsQuery } from '@store/api/apiSlice';

import { sendErrorToBugsnag } from '@lib/bugsnag';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';

/**
 * Responsible for fetching the `syncs`.
 *
 * - Responsible for taking `workspaceId` prop.
 * - Passes `data` to the `useTraceErrorCheck` hook.
 * - Responsible for sending error to `bugsnag`.
 * - returns `data`, `error`, `traceError`, `isFetching` values.
 */

export const useSyncs = (workspaceId: string) => {
  const { data, isFetching, isError, error } = useFetchSyncsQuery(
    {
      workspaceId
    },
    { refetchOnMountOrArgChange: true }
  );

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data);

  if (traceError || isError) {
    // Send error to Bugsnag when a `error` is detected
    sendErrorToBugsnag(traceError || error);
  }

  return { data, isFetching, traceError, error };
};
