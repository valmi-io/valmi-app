/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, August 18th 2023, 6:53:10 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, styled } from '@mui/material';

import SyncRunLogsTable from '@content/Syncs/SyncRunLogs/SyncRunLogsTable';
import {
  generateLogsObject,
  generateLogMessages,
  generateLogPayload,
  LogsType,
  SyncRunLogProps
} from '@content/Syncs/SyncRunLogs/SyncRunLogsUtils';

import SkeletonLoader from '@components/SkeletonLoader';
import ErrorContainer from '@components/Error/ErrorContainer';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import { ErrorStatusText } from '@components/Error';
import ListEmptyComponent from '@components/ListEmptyComponent';

import { useLazyGetSyncRunLogsByIdQuery } from '@store/api/apiSlice';

import { isObjectEmpty } from '@utils/lib';

import { sendErrorToBugsnag } from '@lib/bugsnag';
import { useSyncRunLogs } from './useSyncRunLogs';
import { useFilteredSyncRunLogs } from './useFilteredSyncRunLogs';

const CustomizedCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4)
}));

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

const SyncRunLogs = (props: SyncRunLogProps) => {
  /**
   * Hook -  Responsible for fetching sync run logs.
   *
   * @returns states needed to update the UI.
   */
  const { filteredLogsData, error, isLoading, traceError, handleFetchMore } =
    useFilteredSyncRunLogs({
      since: -1,
      props
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
  const displayPageContent = () => {
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
    <CustomizedCard variant="outlined">
      {/** Display Errors */}
      {error && <ErrorContainer error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      <SkeletonLoader loading={isLoading} />

      {/** Display Content */}
      {!error && !isLoading && filteredLogsData && displayPageContent()}
    </CustomizedCard>
  );
};

export default SyncRunLogs;
