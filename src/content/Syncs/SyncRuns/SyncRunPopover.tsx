/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, November 9th 2023, 6:33:22 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { hasRunningSyncs } from './SyncRunsUtils';
import { useRouter } from 'next/router';
import StopSyncPopoverComponent from './StopSyncPopoverComponent';
import StartSyncPopoverComponent from './StartSyncPopoverComponent';

const SyncRunPopover = (props: any) => {
  const { syncRuns } = props;
  const router = useRouter();
  const url = router.pathname;
  const query = router.query;

  return hasRunningSyncs(syncRuns) ? (
    <StopSyncPopoverComponent
      key={'stopSyncPopover'}
      query={query}
      url={url}
      {...props}
    />
  ) : (
    <StartSyncPopoverComponent
      key={'startSyncPopover'}
      query={query}
      url={url}
      {...props}
    />
  );
};

export default SyncRunPopover;
