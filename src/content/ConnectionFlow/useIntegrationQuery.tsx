import { useFetch } from '@/hooks/useFetch';
import { useFetchIntegrationSpecQuery } from '@/store/api/apiSlice';
import { useGetPackageByIdQuery } from '@/store/api/etlApiSlice';
import { useGetOAuthApiConfigQuery } from '@/store/api/oauthApiSlice';
import { getFreePackageId } from '@/utils/connectionFlowUtils';
import { useMemo } from 'react';

export const useIntegrationQuery = ({
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
    isFetching: isSpecLoading,
    traceError: specTraceError
  } = useFetch({
    query: useFetchIntegrationSpecQuery({ type, workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const {
    data: oauthCredentials,
    error: oauthCredentialsError,
    isFetching: isOauthCredentialsLoading,
    traceError: oauthCredentialsTraceError
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
    error: packagesError,
    isFetching: isPackagesLoading,
    traceError: packagesTraceError
  } = useFetch({
    query: useGetPackageByIdQuery(
      { packageId: getFreePackageId() },
      {
        refetchOnMountOrArgChange: true,
        skip: !workspaceId
      }
    )
  });

  const data = useMemo(() => {
    if (spec && oauthCredentials && packages) {
      return { spec, oauthCredentials, packages };
    }
  }, [spec, oauthCredentials, packages]);

  const error = specError || oauthCredentialsError || packagesError;

  const traceError = specTraceError || oauthCredentialsTraceError || packagesTraceError;

  const isLoading = isSpecLoading || isOauthCredentialsLoading || isPackagesLoading;

  return { data, error, traceError, isLoading };
};
