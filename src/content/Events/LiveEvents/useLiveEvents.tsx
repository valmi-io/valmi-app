/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 2:21:35 pm
 * Author: Nagendra S @ valmi.io
 */

import { useFetch } from '@/hooks/useFetch';
import { useGetLogsQuery } from '@/store/api/streamApiSlice';

export const useLiveEvents = ({
  workspaceId,
  eventType,
  eventId
}: {
  workspaceId: string;
  eventType: string;
  eventId: string;
}) => {
  const { data, isLoading, isFetching, traceError, error } = useFetch({
    query: useGetLogsQuery(
      { workspaceId: workspaceId, eventType: eventType, eventId: eventId },
      { pollingInterval: 5000 }
    )
  });

  return { data, isLoading, isFetching, traceError, error };
};
