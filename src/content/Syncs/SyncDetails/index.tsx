/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 17th 2023, 7:40:50 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useState } from 'react';
import {
  useLazyGetSyncByIdQuery,
  useLazyToggleSyncQuery
} from '../../../store/api/apiSlice';
import {
  getErrorsInData,
  hasErrorsInData
} from '../../../components/Error/ErrorUtils';
import { useRouter } from 'next/router';
import { Card } from '@mui/material';

import ErrorComponent, { ErrorStatusText } from '../../../components/Error';
import SkeletonLoader from '../../../components/SkeletonLoader';
import SyncDetailsCard from './SyncDetailsCard';
import { SkeletonContainer } from '../../../components/Layouts/Layouts';
import { useDispatch, useSelector } from 'react-redux';
import { setFlowState } from '../../../store/reducers/syncFlow';
import { RootState } from '../../../store/reducers';
import { getRouterPathname, isPublicSync } from '../../../utils/routes';

const SyncDetails = ({ syncId, workspaceId }: any) => {
  const router = useRouter();

  const url = router.pathname;
  const query = router.query;

  const dispatch = useDispatch();

  const [displayError, setDisplayError] = useState(null);
  const [syncDetails, setSyncDetails] = useState(null);

  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const [getSyncDetails, { data, isFetching, isError, error }] =
    useLazyGetSyncByIdQuery();

  const [toggleSync, { data: updateSyncData }] = useLazyToggleSyncQuery();

  useEffect(() => {
    if (updateSyncData) {
      if (!isPublicSync(getRouterPathname(query, url))) {
        const payload = {
          syncId: syncId,
          workspaceId: workspaceId
        };
        getSyncDetails(payload);
      }
    }
  }, [updateSyncData]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!isPublicSync(getRouterPathname(query, url))) {
      const payload = {
        syncId: syncId,
        workspaceId: workspaceId
      };
      getSyncDetails(payload);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setDisplayError(traceError);
      } else {
        setSyncDetails(data);
      }
    }
  }, [data]);

  const handleSyncSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
    val: any,
    syncData: any
  ) => {
    event.stopPropagation();

    const payload = {
      config: {
        sync_id: syncData.id
      },
      enable: val,
      workspaceId: workspaceId
    };
    toggleSync(payload);
  };

  const handleEditSync = (data: any) => {
    const { id: syncId = '', source = {}, destination = {} } = data || {};

    if (data?.ui_state?.steps) {
      dispatch(
        setFlowState({
          ...flowState,
          steps: data.ui_state.steps,
          destinationCatalog: data.ui_state.destinationCatalog,
          sourceCatalog: data.ui_state.sourceCatalog,
          isEditableFlow: true,
          extra: {
            syncId: syncId,
            source: source,
            destination: destination
          }
        })
      );

      router.push(`/spaces/${workspaceId}/syncs/create`);
    }
  };

  return (
    <Card variant="outlined">
      {/** Displaying Errors */}
      {isError && <ErrorComponent error={error} />}
      {/** Displaying Trace Error */}
      {displayError && <ErrorStatusText>{displayError}</ErrorStatusText>}

      {isFetching && (
        <SkeletonContainer>
          <SkeletonLoader />
        </SkeletonContainer>
      )}

      {isPublicSync(getRouterPathname(query, url)) ? (
        <SyncDetailsCard
          syncData={syncDetails}
          handleSyncSwitch={handleSyncSwitch}
          handleEditSync={handleEditSync}
          isPublicSync={isPublicSync(getRouterPathname(query, url))}
        />
      ) : (
        !isError &&
        !isFetching &&
        syncDetails && (
          <SyncDetailsCard
            syncData={syncDetails}
            handleSyncSwitch={handleSyncSwitch}
            handleEditSync={handleEditSync}
            isPublicSync={false}
          />
        )
      )}
    </Card>
  );
};

export default SyncDetails;
