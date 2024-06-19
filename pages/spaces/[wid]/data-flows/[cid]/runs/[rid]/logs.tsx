import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import SyncRunLogsTable from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useTheme } from '@mui/material';
import { useSyncRunLogs } from '@/content/Syncs/SyncRunLogs/useSyncRunLogs';
import { copy, isDataEmpty } from '@/utils/lib';
import { generateLogsObject } from '@/content/Syncs/SyncRunLogs/SyncRunLogsUtils';
import Modal from '@/components/Modal';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import EventsFooter from '@/content/Syncs/EventsFooter';

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

  const { rid = '1', cid = '1', connection_type = '' } = router.query as any;

  const { workspaceId = '' } = useWorkspaceId();

  const logProps = {
    syncId: cid,
    runId: rid,
    connectionType: connection_type,
    workspaceId: workspaceId!
  };

  /**
   * Hook -  Responsible for fetching sync run logs.
   *
   * @returns states needed to update the UI.
   */
  const {
    data: logs,
    error,
    traceError,
    fetchLogs,
    isFetching,
    isLoading
  } = useSyncRunLogs({
    since: -1,
    props: logProps
  });

  const [state, setState] = useState<{ ids: string[]; entities: any } | null>(null);

  const [rowState, setRowState] = useState<{ data: any; show: boolean; copied: boolean }>({
    data: null,
    show: false,
    copied: false
  });

  useEffect(() => {
    if (logs) {
      processData(logs);
    }
  }, [logs]);

  /**
   * Fetches sync run logs every 3 seconds
   */
  useEffect(() => {
    if (state) {
      if (state?.ids.length > 0 && !error) {
        const interval = 5000; // in milliseconds
        const runInterval = setInterval(handleFetchMore, interval);
        return () => {
          clearInterval(runInterval);
        };
      }
    }
  }, [state]);

  /**
   * Checks if since exists in SincesArray
   * @param sincesArray
   * @param since
   * @returns true | false
   */

  const isExistingId = ({ arr, id }: { arr: string[]; id: string }) => {
    return arr.includes(id);
  };

  const processData = (logs: any) => {
    let sinceVal = getSinceVal(logs);
    let beforeVal = getBeforeVal(logs);

    if (!sinceVal) {
      // Generate the new payload with updated since property.
      // If before is null, since = -1
      fetchLogs({ since: beforeVal ?? -1, props: logProps });
    } else {
      // Append since, if not existed in existing sinces array.
      const ids = state?.ids ?? [];
      const entities = state?.entities ?? {};

      const existingId = isExistingId({ arr: ids, id: sinceVal });

      setState((state) => ({
        ids: !existingId ? [...ids, sinceVal] : ids,
        entities: {
          ...entities,
          ...generateLogsObject(sinceVal, logs)
        }
      }));
    }
  };

  const getSinceVal = (logs: any) => {
    const { meta: { since = null } = {} } = logs ?? {};
    return since;
  };

  const getBeforeVal = (logs: any) => {
    const { meta: { before = null } = {} } = logs ?? {};
    return before;
  };

  const handleFetchMore = () => {
    let beforeVal = getBeforeVal(logs);

    let sinceVal = getSinceVal(logs);

    if (beforeVal) {
      sinceVal = beforeVal;
    }

    // Generate the new payload with updated since.
    fetchLogs({ since: sinceVal, props: logProps });
  };

  const handleRowOnClick = ({ data }: any) => {
    setRowState((state) => ({
      ...state,
      data: data,
      copied: false,
      show: true
    }));
  };

  const handleCopy = () => {
    if (rowState.data) {
      setRowState((state) => ({
        ...state,
        copied: true
      }));

      copy(rowState.data);
    }
  };

  const handleCloseDialog = () => {
    setRowState((state) => ({
      ...state,
      show: false
    }));
  };

  return (
    <PageLayout
      pageHeadTitle={connection_type === 'src' ? 'Source Log History' : 'Destination Log History'}
      title={connection_type === 'src' ? 'SOURCE LOG HISTORY' : 'DESTINATION LOG HISTORY'}
      displayButton={false}
    >
      <ContentLayout
        key={`syncsLogsPage`}
        error={error}
        PageContent={
          <PageContent
            handleRowOnClick={handleRowOnClick}
            isFetching={isFetching}
            state={state}
            workspaceId={workspaceId}
          />
        }
        displayComponent={!error && !isLoading && !!state}
        isLoading={isLoading}
        traceError={traceError}
        cardStyles={{ marginTop: theme.spacing(1) }}
      />
      <Modal
        title="Run Details"
        open={rowState.show}
        onClose={handleCloseDialog}
        handleCopy={handleCopy}
        data={rowState.data}
        copy={true}
        isCopied={rowState.copied}
      />
    </PageLayout>
  );
};

SyncRunLogsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncRunLogsPage;

/**
 * Responsible for displaying Logs Table.
 * @returns Logs, and Empty Component based on data.
 */
const PageContent = ({
  state,
  handleRowOnClick,
  isFetching,
  workspaceId
}: {
  state: any;
  handleRowOnClick: any;
  isFetching: boolean;
  workspaceId: string;
}) => {
  console.log('State:_', state);
  if (isDataEmpty(state)) {
    return <ListEmptyComponent description={'No data.'} />;
  }

  return (
    <>
      <SyncRunLogsTable key={`syncRunsLogsTable-${workspaceId}`} onRowClick={handleRowOnClick} data={state} />
      <EventsFooter isFetching={isFetching} />
    </>
  );
};
