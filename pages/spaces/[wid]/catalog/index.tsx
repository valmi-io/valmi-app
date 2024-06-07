import React, { ReactElement, useEffect, useMemo } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Paper, Stack } from '@mui/material';

import { useFetchConnectorsQuery } from '@store/api/apiSlice';
import { useFetch } from '@/hooks/useFetch';
import constants from '@constants/index';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import ConnectorsPageContent from '@/content/ConnectionFlow/Connectors/ConnectorsPageContent';
import { useLazyFetchCredentialsQuery } from '@/store/api/apiSlice';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { TCatalog } from '@/utils/typings.d';

/**
 * Filters the list of catalog sources to include only those that are of type 'SRC'
 * and have 'etl' as one of their modes.
 */
const getEtlSources = ({ sources }: { sources: TCatalog[] }): TCatalog[] => {
  const etlSources = sources.reduce<TCatalog[]>((acc, source) => {
    const type = source.type.split('_')[0];

    if (source.mode && source.mode.includes('etl') && type === 'SRC') {
      acc.push(source);
    }
    return acc;
  }, []);

  return etlSources;
};

const CatalogPage = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({}, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const [fetchCredentials, { data: credentialsData }] = useLazyFetchCredentialsQuery();

  useEffect(() => {
    fetchCredentials({ workspaceId });
  }, []);

  const sources = useMemo(() => {
    if (data) return getEtlSources({ sources: data.SRC || [] });
    return [];
  }, [data]);

  return (
    <PageLayout pageHeadTitle="Integrations" title={constants.catalog.CREATE_CONNECTION_TITLE} displayButton={false}>
      <Paper variant="elevation">
        {/** Display error */}
        {error && <ErrorComponent error={error} />}

        {/* Display trace error */}
        {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

        {/** Display skeleton */}
        <SkeletonLoader loading={isLoading} />

        {/** Display page content */}
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {!error && !isLoading && data && (
            <ConnectorsPageContent data={sources} credentialsData={credentialsData?.resultData} />
          )}
        </Stack>
      </Paper>
    </PageLayout>
  );
};

CatalogPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CatalogPage;
