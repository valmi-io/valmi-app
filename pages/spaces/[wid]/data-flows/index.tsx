/*
 * Connections page
 * This component represents a page for displaying connections and creating / editing connection.
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { AppDispatch } from '@store/store';
import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useFetch } from '@/hooks/useFetch';
import { useFetchSyncsQuery } from '@/store/api/apiSlice';
import { clearConnectionFlowState } from '@/store/reducers/connectionDataFlow';
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const {
    data: connections,
    error,
    isFetching,
    traceError
  } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const handleCreateConnectionOnClick = () => {
    router.push(`/spaces/${workspaceId}/catalog`);
  };

  useEffect(() => {
    // initialising sync flow state
    dispatch(clearConnectionFlowState());
  }, []);

  return (
    <PageLayout
      pageHeadTitle="Data Flows"
      title="DATA FLOWS"
      buttonTitle="Connection"
      handleButtonOnClick={handleCreateConnectionOnClick}
    >
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
