// @ts-nocheck

/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:19:04 am
 * Author: Nagendra S @ valmi.io
 */
import { Card } from '@mui/material';

import SyncsTable from '@content/Syncs/SyncsPage/SyncsTable';
import { useSyncsData } from '@content/Syncs/SyncsPage/useSyncsData';

import { ErrorStatusText } from '@components/Error';
import SkeletonLoader from '@components/SkeletonLoader';
import { SkeletonContainer } from '@components/Layouts/Layouts';
import ListEmptyComponent from '@components/ListEmptyComponent';
import ErrorContainer from '@components/Error/ErrorContainer';

type SyncsProps = {
  workspaceId: string;
};

const Syncs = (props: SyncsProps) => {
  const { workspaceId } = props;

  const { data, isFetching, traceError, syncsError } =
    useSyncsData(workspaceId);

  const displayPageContent = () => {
    if (data.length > 0) {
      // Display syncs when syncs data length > 0
      return <SyncsTable syncs={data} />;
    }

    // Display empty component
    return (
      <ListEmptyComponent description={'No syncs found in this workspace'} />
    );
  };

  return (
    <Card variant="outlined">
      {/** Display Errors */}
      {syncsError && <ErrorContainer error={syncsError} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      {isFetching && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}

      {/** Display page content */}
      {!syncsError && !isFetching && data && displayPageContent()}
    </Card>
  );
};

export default Syncs;
