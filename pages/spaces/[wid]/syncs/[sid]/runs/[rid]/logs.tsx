/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:47:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ContentLayout from '@/layouts/ContentLayout';
import { useFilteredSyncRunLogs } from '@/content/Syncs/SyncRunLogs/useFilteredSyncRunLogs';
import SyncRunLogsTable from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useTheme } from '@mui/material';

/**
 * Responsible for rendering the logs page and its components.
 *
 * - Queries for `syncRunLogs`.
 * - Passes `syncRunLogs` prop to the `SyncRunLogsTable` component.
 * - Passes `fetch, isFetching` props to the `SyncRunLogFooter` component
 *  and responsible for handling `handleFetchMore` function.
 * - Passes `error` prop to the  `ErrorContainer` component.
 * - Passes `traceError` prop to the `ErrorStatusText` component
 * - Responsible for rendering `ListEmptyComponent` when `logs` are empty.
 */

const SyncRunLogsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const theme = useTheme();

  const { rid = '1', sid = '1', connection_type = '' } = router.query as any;
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  /**
   * Hook -  Responsible for fetching sync run logs.
   *
   * @returns states needed to update the UI.
   */
  const { filteredLogsData, error, isLoading, traceError, handleFetchMore } = useFilteredSyncRunLogs({
    since: -1,
    props: {
      // syncId: {sid},
      // runId={rid} connectionType={connection_type} workspaceId={workspaceId}
      syncId: sid,
      runId: rid,
      connectionType: connection_type,
      workspaceId: workspaceId
    }
  });

  /**
   * Fetches sync run logs every 3 seconds
   */
  useEffect(() => {
    if (filteredLogsData?.length > 0 && !error) {
      const interval = 3000; // in milliseconds
      const runInterval = setInterval(handleFetchMore, interval);
      return () => {
        clearInterval(runInterval);
      };
    }
  }, [filteredLogsData]);

  /**
   * Responsible for displaying Logs Table.
   * @returns Logs, and Empty Component based on data.
   */
  const PageContent = () => {
    if (filteredLogsData?.length > 0) {
      return (
        <>
          <SyncRunLogsTable syncRunLogs={filteredLogsData} />
        </>
      );
    }

    // Display empty component
    return <ListEmptyComponent description={'No logs found in this run'} />;
  };

  return (
    <PageLayout
      pageHeadTitle={connection_type === 'src' ? 'Source Log History' : 'Destination Log History'}
      title={connection_type === 'src' ? 'Source Log History' : 'Destination Log History'}
      displayButton={false}
    >
      <ContentLayout
        key={`syncsLogsPage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && filteredLogsData}
        isLoading={isLoading}
        traceError={traceError}
        cardStyles={{ marginTop: theme.spacing(4) }}
      />
    </PageLayout>
  );
};

SyncRunLogsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncRunLogsPage;
