/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 2nd 2024, 1:28:26 pm
 * Author: Nagendra S @ valmi.io
 */

import { sendErrorToBugsnag } from '@lib/bugsnag';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';

/**
 * Responsible for fetching the `objects`.
 *
 * - Responsible for taking `query` prop.
 * - Passes `data` to the `useTraceErrorCheck` hook.
 * - Responsible for sending error to `bugsnag`.
 * - returns `data`, `error`, `traceError`, `isFetching` values.
 */

export const useFetch = ({ query }: { query: any }) => {
  const { data, isLoading, isFetching, isError, error } = query;

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data);

  if (traceError || isError) {
    // Send error to Bugsnag when a `error` is detected
    sendErrorToBugsnag(traceError || error);
  }

  return { data, isLoading, isFetching, traceError, error };
};
