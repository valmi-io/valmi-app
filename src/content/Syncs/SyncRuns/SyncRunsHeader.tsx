/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, November 9th 2023, 6:38:53 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import PageTitle from '@components/PageTitle';
import PopoverComponent from '@components/Popover';

import { getPageButtonTitle } from './SyncRunsUtils';
import { getRouterPathname, isPublicSync } from '@utils/routes';
import SyncRunPopover from './SyncRunPopover';
import { SyncRunContext } from '@contexts/Contexts';

const SyncRunsHeader = ({ syncRuns, workspaceId, syncId }: any) => {
  const router = useRouter();
  const url = router.pathname;
  const query = router.query;

  // Popover states
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [isPromisePending, setIsPromisePending] = useState(false);

  const contextValue = useMemo(
    () => ({ isPromisePending, setIsPromisePending }),
    [isPromisePending]
  );

  // Popover open handler
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Popover close handler
  const handlePopoverClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <SyncRunContext.Provider value={contextValue}>
      <PageTitle
        title={'Run History'}
        displayButton={true}
        buttonTitle={getPageButtonTitle(
          isPublicSync(getRouterPathname(query, url)),
          syncRuns,
          isPromisePending
        )}
        disabled={isPromisePending}
        onClick={handlePopoverOpen}
        link={isPublicSync(getRouterPathname(query, url)) ? true : false}
        linkurl={process.env.PUBLIC_SYNC_URL}
        isFetching={isPromisePending}
        displayStartIcon={false}
      />

      {/** Start Sync - Popover components */}

      {Boolean(anchorEl) && (
        <PopoverComponent anchorEl={anchorEl} onClose={handlePopoverClose}>
          <SyncRunPopover
            syncRuns={syncRuns}
            isQueryPending={isPromisePending}
            workspaceId={workspaceId}
            syncId={syncId}
            closePopover={handlePopoverClose}
          />
        </PopoverComponent>
      )}
    </SyncRunContext.Provider>
  );
};

export default SyncRunsHeader;
