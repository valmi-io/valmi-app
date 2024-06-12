import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useFetch } from '@/hooks/useFetch';
import { useFetchSyncsQuery } from '@/store/api/apiSlice';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import DataFlows from '@/content/DataFlows';

const PageContent = ({ data }: { data: any }) => {
  console.log('Page content:_', data);
  if (data.length > 0) {
    // Display syncs when syncs data length > 0
    return <DataFlows syncs={data} />;
  }

  // Display empty component
  return <ListEmptyComponent description={'No connections found in this workspace'} />;
};

const DataFlowsPage: NextPageWithLayout = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const {
    data: connections,
    error,
    isFetching,
    traceError
  } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  return (
    <PageLayout pageHeadTitle="Data Flows" title="DATA FLOWS" displayButton={false}>
      <ContentLayout
        key={`connectionsPage`}
        error={error}
        PageContent={<PageContent data={connections} />}
        displayComponent={!error && !isFetching && connections}
        isLoading={isFetching}
        traceError={traceError}
      />
    </PageLayout>
  );
};

DataFlowsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default DataFlowsPage;
