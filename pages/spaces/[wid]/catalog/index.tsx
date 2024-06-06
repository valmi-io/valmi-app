import React, { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Paper, Stack } from '@mui/material';

import { getCombinedConnectors } from '@/utils/lib';
import { useFetchConnectorsQuery } from '@store/api/apiSlice';
import { useFetch } from '@/hooks/useFetch';
import constants from '@constants/index';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import ConnectorsPageContent from '@/content/ConnectionFlow/Connectors/ConnectorsPageContent';
import { useLazyFetchCredentialsQuery } from '@/store/api/apiSlice';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const CatalogPage = () => {
  const router = useRouter();
  const { workspaceId = '' } = useWorkspaceId();

  const { workspaceId = '' } = useWorkspaceId();

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({}, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const [fetchCredentials, { data: credentialsData }] = useLazyFetchCredentialsQuery();

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'all');
    router.push(url);
    fetchCredentials({ workspaceId });
  }, []);

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
            <ConnectorsPageContent
              data={data && getCombinedConnectors(data)}
              credentialsData={credentialsData?.resultData}
            />
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
