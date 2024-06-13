import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { AppDispatch } from '@store/store';
import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { clearConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useConnectionsData } from '@/content/Connections/useConnectionsData';
import ConnectionsTable from '@/content/Connections/ConnectionsTable';
import { TConnection } from '@/utils/typings.d';

const PageContent = ({ data, id }: { data: TConnection[]; id: string }) => {
  if (data.length > 0) {
    return <ConnectionsTable connections={data} id={id} />;
  }

  // Display empty component
  return <ListEmptyComponent description={'No connections found in this workspace'} />;
};

const ConnectionsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id = '' } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const { data, error, isFetching, traceError } = useConnectionsData(workspaceId);

  const handleCreateConnectionOnClick = () => {
    router.push(`/spaces/${workspaceId}/catalog`);
  };

  useEffect(() => {
    // reset connection flow state.
    dispatch(clearConnectionFlowState());
  }, []);

  return (
    <PageLayout
      pageHeadTitle="Data Flows"
      title="DATA FLOWS"
      buttonTitle="Data Flow"
      handleButtonOnClick={handleCreateConnectionOnClick}
    >
      <ContentLayout
        key={`connectionsPage`}
        error={error}
        PageContent={<PageContent data={data} id={id as string} />}
        displayComponent={!error && !isFetching && data}
        isLoading={isFetching}
        traceError={traceError}
      />
    </PageLayout>
  );
};

ConnectionsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionsPage;
