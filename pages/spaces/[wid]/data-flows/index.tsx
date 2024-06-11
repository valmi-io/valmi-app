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
  if (data.length > 0) {
    // Display syncs when syncs data length > 0
    return <DataFlows syncs={data} />;
  }

  // Display empty component
  return <ListEmptyComponent description={'No connections found in this workspace'} />;
};

const ConnectionsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const {
    data: syncs,
    error,
    isFetching,
    traceError
  } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });
  console.log('syncs:', syncs);
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
        PageContent={<PageContent data={syncs} />}
        displayComponent={!error && !isFetching && syncs}
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
