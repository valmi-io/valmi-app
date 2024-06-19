import { useFetchSyncsQuery } from '@store/api/apiSlice';

import { useFetch } from '@/hooks/useFetch';

export const useConnectionsData = (workspaceId: string) => {
  const { data, error, isFetching, traceError } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  return {
    data,
    isFetching,
    traceError,
    error
  };
};
