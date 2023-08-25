// @ts-nocheck

/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:19:04 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { Card } from '@mui/material';

import { useSelector } from 'react-redux';
import { useFetchSyncsQuery } from '../../../store/api/apiSlice';
import { RootState } from '../../../store/reducers';
import SyncsTable from './SyncsTable';
import { ErrorStatusText } from '../../../components/Error';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../../components/Error/ErrorUtils';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { SkeletonContainer } from '../../../components/Layouts/Layouts';

import ListEmptyComponent from '../../../components/ListEmptyComponent';
import ErrorContainer from '../../../components/Error/ErrorContainer';

import { sendErrorToBugsnag } from '../../../lib/bugsnag';

const Syncs = () => {
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const { data, isFetching, isError, error } = useFetchSyncsQuery(
    {
      workspaceId
    },
    { refetchOnMountOrArgChange: true }
  );

  const [syncsData, setSyncsData] = useState(null);

  const [traceError, setTraceError] = useState<any>(null);

  // This useEffect will handle data
  useEffect(() => {
    if (data) {
      // Fetch trace errors in the data.
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        // send error to Bugsnag
        sendErrorToBugsnag(traceError);

        setTraceError(traceError);
      } else {
        setSyncsData(data);
      }
    }
  }, [data]);

  // This useEffect will handle errors.
  useEffect(() => {
    if (isError) {
      // send error to Bugsnag
      sendErrorToBugsnag(error);
    }
  }, [isError]);

  // Page content
  const displayContent = () => {
    if (syncsData.length > 0) {
      // Display Syncs table.
      return <SyncsTable syncs={syncsData} />;
    }

    // Display empty component
    return (
      <ListEmptyComponent description={'No syncs found in this workspace'} />
    );
  };

  return (
    <Card variant="outlined">
      {/** Display Errors */}
      {isError && <ErrorContainer error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      {isFetching && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}

      {/** Display Content */}
      {!isError && !isFetching && syncsData && displayContent()}
    </Card>
  );
};

export default Syncs;
