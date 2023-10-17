/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, October 17th 2023, 2:01:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import { useFetchSyncsQuery } from '@store/api/apiSlice';

import { sendErrorToBugsnag } from '@lib/bugsnag';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';

export const useSyncsData = (workspaceId: string) => {
  const [syncsError, setSyncsError] = useState<any>(null);

  const { data, isFetching, isError, error } = useFetchSyncsQuery(
    {
      workspaceId
    },
    { refetchOnMountOrArgChange: true }
  );

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data);

  if (traceError) {
    // Send error to Bugsnag when a trace error is detected
    sendErrorToBugsnag(traceError);
  }

  if (isError && !syncsError) {
    // Send error to Bugsnag when a general error occurs
    setSyncsError(error);
    sendErrorToBugsnag(error);
  }

  return { data, isFetching, traceError, syncsError };
};
