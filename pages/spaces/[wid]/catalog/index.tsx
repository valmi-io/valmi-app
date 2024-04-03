import React, { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Box, Button, CardActions, CircularProgress, Grid, Paper, Stack, useTheme } from '@mui/material';
import { EventSourceType, extDestinations } from '@/constants/extDestinations';
import { getBaseRoute, getCombinedConnectors } from '@/utils/lib';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import { useFetchConnectorsQuery } from '@store/api/apiSlice';
import { useFetch } from '@/hooks/useFetch';
import constants from '@constants/index';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import ConnectorsPageContent from '@/content/ConnectionFlow/Connectors/ConnectorsPageContent';

const CreateWarehousePage = () => {
  const theme = useTheme();
  const router = useRouter();

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({}, { refetchOnMountOrArgChange: true })
  });

  const { wid } = router.query;

  const [selectedType, setSelectedType] = useState<string>('');

  const handleItemOnClick = ({ type }: EventSourceType) => {
    setSelectedType(type);
  };

  const onSubmitClick = () => {
    router.push(`${getBaseRoute(wid as string)}/destination-warehouses/create/${selectedType}`);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'all');
    router.push(url);
  }, []);

  return (
    <PageLayout pageHeadTitle="Integrations" title={constants.catalog.CREATE_CONNECTION_TITLE} displayButton={false}>
      <Paper variant="outlined">
        {/** Display error */}
        {error && <ErrorComponent error={error} />}

        {/* Display trace error */}
        {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

        {/** Display skeleton */}
        <SkeletonLoader loading={isLoading} />

        {/** Display page content */}
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {!error && !isLoading && data && <ConnectorsPageContent data={data && getCombinedConnectors(data)} />}
        </Stack>
      </Paper>
    </PageLayout>
  );
};

CreateWarehousePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateWarehousePage;
