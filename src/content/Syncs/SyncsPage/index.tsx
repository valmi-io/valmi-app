// @ts-nocheck

/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:19:04 am
 * Author: Nagendra S @ valmi.io
 */

import { Card } from '@mui/material';

import SyncsTable from '@content/Syncs/SyncsPage/SyncsTable';
import { useSyncs } from '@/content/Syncs/SyncsPage/useSyncs';

import { ErrorStatusText } from '@components/Error';
import ListEmptyComponent from '@components/ListEmptyComponent';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '@components/SkeletonLoader';

type SyncsProps = {
  workspaceId: string;
};

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

const Syncs = ({ workspaceId = '' }: SyncsProps) => {
  const { data: syncs, isFetching, traceError, error } = useSyncs(workspaceId);

  const PageContent = () => {
    if (syncs.length > 0) {
      // Display syncs when syncs data length > 0
      return <SyncsTable syncs={syncs} />;
    }

    // Display empty component
    return (
      <ListEmptyComponent description={'No syncs found in this workspace'} />
    );
  };

  return (
    <Card variant="outlined">
      {/** Display error */}
      {error && <ErrorContainer error={error} />}

      {/** Display trace error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display skeleton */}
      <SkeletonLoader loading={isFetching} />

      {/** Display page content */}
      {!error && !isFetching && syncs && <PageContent />}
    </Card>
  );
};

export default Syncs;
