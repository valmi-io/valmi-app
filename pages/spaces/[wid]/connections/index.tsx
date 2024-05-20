/*
 * Connections page
 * This component represents a page for displaying connections and creating / editing connection.
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { initialiseFlowState } from '@content/SyncFlow/stateManagement';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import SyncsTable from '@/content/Syncs/SyncsPage/SyncsTable';
import { useFetch } from '@/hooks/useFetch';
import { useFetchSyncsQuery } from '@/store/api/apiSlice';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const ConnectionsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const { workspaceId = null } = useWorkspaceId();

  const {
    data: syncs,
    error,
    isFetching,
    traceError
  } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: workspaceId ? false : true })
  });

  const handleCreateConnectionOnClick = () => {
    router.push(`/spaces/${workspaceId}/catalog`);
  };

  useEffect(() => {
    // initialising sync flow state
    initialiseFlowState(dispatch, flowState, false);
  }, []);

  const PageContent = () => {
    if (syncs.length > 0) {
      // Display syncs when syncs data length > 0
      return <SyncsTable syncs={syncs} />;
    }

    // Display empty component
    return <ListEmptyComponent description={'No connections found in this workspace'} />;
  };

  return (
    <PageLayout
      pageHeadTitle="Connections"
      title="Connections"
      buttonTitleInHeader="Connection"
      handleButtonInHeaderOnClick={handleCreateConnectionOnClick}
    >
      <ContentLayout
        key={`connectionsPage`}
        error={error}
        PageContent={<PageContent />}
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
