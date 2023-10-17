// @ts-nocheck

/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, October 17th 2023, 3:28:21 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import { useFetchCredentialsQuery } from '@store/api/apiSlice';

import { useTraceErrorCheck } from '@hooks/useTraceErrorCheck';

import { sendErrorToBugsnag } from '@lib/bugsnag';

export const useConnectionsData = (workspaceId: string) => {
  const [connectionsError, setConnectionsError] = useState<any>(null);

  const { data, isFetching, isError, error } = useFetchCredentialsQuery(
    {
      workspaceId,
      queryId: 0
    },
    { refetchOnMountOrArgChange: true }
  );

  // Use the custom hook to check for trace errors in the data
  const traceError = useTraceErrorCheck(data && data.resultData);

  if (traceError) {
    // Send error to Bugsnag when a trace error is detected
    sendErrorToBugsnag(traceError);
  }

  if (isError && !connectionsError) {
    // Send error to Bugsnag when a general error occurs
    setConnectionsError(error?.errorData);
    sendErrorToBugsnag(error?.errorData);
  }

  return {
    data: data ? data?.resultData : [],
    isFetching,
    traceError,
    connectionsError
  };
};
