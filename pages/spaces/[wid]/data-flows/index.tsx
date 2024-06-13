import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import DataFlows from '@/content/DataFlows';
import { useConnectionsData } from '@/content/Connections/useConnectionsData';
import { TConnection } from '@/utils/typings.d';

const PageContent = ({ data }: { data: TConnection[] }) => {
  if (data.length > 0) {
    return <DataFlows connections={data} />;
  }

  // Display empty component
  return <ListEmptyComponent description={'No connections found in this workspace'} />;
};

const DataFlowsPage: NextPageWithLayout = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const { data, error, isFetching, traceError } = useConnectionsData(workspaceId);

  return (
    <PageLayout pageHeadTitle="Data Flows" title="DATA FLOWS" displayButton={false}>
      <ContentLayout
        key={`dataflowspage`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!error && !isFetching && data}
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
