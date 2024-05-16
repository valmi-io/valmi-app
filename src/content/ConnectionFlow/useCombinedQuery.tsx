import { useFetch } from '@/hooks/useFetch';
import { useFetchIntegrationSpecQuery } from '@/store/api/apiSlice';
import { useGetPackageByIdQuery } from '@/store/api/etlApiSlice';
import { useGetOAuthApiConfigQuery } from '@/store/api/oauthApiSlice';
import { getFreePackageId } from '@/utils/connectionFlowUtils';
import { useMemo } from 'react';

export const useCombinedIntegrationConfigQuery = ({
  type,
  workspaceId,
  oauthKeys
}: {
  type: string;
  oauthKeys: string;
  workspaceId: string;
}) => {
  const {
    data: spec,
    error: specError,
    isFetching: specIsLoading,
    traceError: specTraceError
  } = useFetch({
    query: useFetchIntegrationSpecQuery({ type, workspaceId }, { refetchOnMountOrArgChange: true, skip: false })
  });

  const {
    data: oauthKeysData,
    error: oauthKeysError,
    isFetching: oauthKeysIsLoading,
    traceError: oauthKeysTraceError
  } = useFetch({
    query: useGetOAuthApiConfigQuery(
      { type, workspaceId },
      {
        refetchOnMountOrArgChange: true,
        skip: spec ? false : true
      }
    )
  });

  const {
    data: packages,
    error: packageError,
    isFetching: packageIsLoading,
    traceError: packageTraceError
  } = useFetch({
    query: useGetPackageByIdQuery(
      { packageId: getFreePackageId() },
      {
        refetchOnMountOrArgChange: true
      }
    )
  });

  const data = useMemo(() => {
    if (spec && oauthKeysData && packages) {
      return { spec, oauthKeysData, packages };
    }
  }, [spec, oauthKeysData, packages]);

  const error = specError || oauthKeysError || packageError;

  const traceError = specTraceError || oauthKeysTraceError || packageTraceError;

  const isLoading = specIsLoading || oauthKeysIsLoading || packageIsLoading;

  return { data, error, traceError, isLoading };
};
