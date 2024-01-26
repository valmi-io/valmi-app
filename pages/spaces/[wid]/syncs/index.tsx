/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * SyncsPage Component
 * This component represents a page for displaying syncs and creating new syncs.
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

/**
 * Responsible for rendering the syncs page and its components.
 *
 * - Responsible for passing `workspaceId` to `useSyncs` hook.
 * - Passes `syncs` prop to the `SyncsTable` component.
 * - Passes `error` prop to the  `ErrorContainer` component.
 * - Passes `traceError` prop to the `ErrorStatusText` component
 * - Responsible for the container card styles.
 * - Responsible for rendering `ListEmptyComponent` when `syncs` are empty.
 */
const SyncsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const { workspaceId = '' } = appState;

  const {
    data: syncs,
    error,
    isFetching,
    traceError
  } = useFetch({
    query: useFetchSyncsQuery({ workspaceId }, { refetchOnMountOrArgChange: true })
  });

  const handleCreateSyncOnClick = () => {
    router.push(`/spaces/${workspaceId}/syncs/create`);
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
    return <ListEmptyComponent description={'No syncs found in this workspace'} />;
  };

  return (
    <PageLayout pageHeadTitle="Syncs" title="Syncs" buttonTitle="Sync" handleButtonOnClick={handleCreateSyncOnClick}>
      <ContentLayout
        key={`syncsPage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isFetching && syncs}
        isLoading={isFetching}
        traceError={traceError}
      />
    </PageLayout>
  );
};

SyncsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncsPage;
