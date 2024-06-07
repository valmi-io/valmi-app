import React, { ReactElement } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Paper, Stack, styled } from '@mui/material';

import { useFetchConnectorsQuery } from '@store/api/apiSlice';
import { useFetch } from '@/hooks/useFetch';
import constants from '@constants/index';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import CatalogList from '@/content/Catalog/CatalogList';

const StackContainer = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center'
}));

const CatalogPage = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

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
        <StackContainer>{!error && !isLoading && data && <CatalogList catalogs={data?.SRC ?? []} />}</StackContainer>
      </Paper>
    </PageLayout>
  );
};

CatalogPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CatalogPage;
