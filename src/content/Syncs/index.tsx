// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:19:04 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';

import { Card } from '@mui/material';

import { useSelector } from 'react-redux';
import { useFetchSyncsQuery } from '../../store/api/apiSlice';
import { RootState } from '../../store/reducers';
import SyncsTable from './SyncsTable';
import { ErrorStatusText } from '../../components/Error';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../components/Error/ErrorUtils';
import SkeletonLoader from '../../components/SkeletonLoader';
import { SkeletonContainer } from '../../components/Layouts/Layouts';

import ListEmptyComponent from '../../components/ListEmptyComponent';
import ErrorContainer from '../../components/Error/ErrorContainer';

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
  const [displayError, setDisplayError] = useState(null);

  useEffect(() => {
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setDisplayError(traceError);
      } else {
        setSyncsData(data);
      }
    }
  }, [data]);

  const displayContent = () => {
    if (syncsData.length > 0) {
      return <SyncsTable syncs={syncsData} />;
    }
    return (
      <ListEmptyComponent description={'No syncs found in this workspace'} />
    );
  };

  return (
    <Card variant="outlined">
      {/** Displaying Errors */}
      {isError && <ErrorContainer error={error} />}
      {/** Displaying Trace Error */}
      {displayError && <ErrorStatusText>{displayError}</ErrorStatusText>}

      {isFetching && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}
      {!isError && !isFetching && syncsData && displayContent()}
    </Card>
  );
};

export default Syncs;
