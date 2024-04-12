/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 17th 2023, 7:40:50 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { Card } from '@mui/material';

import SyncDetailsCard from '@content/Syncs/SyncDetails/SyncDetailsCard';

import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import ErrorComponent, { ErrorStatusText } from '@components/Error';
import SkeletonLoader from '@components/SkeletonLoader';

import { useLazyGetSyncByIdQuery, useLazyToggleSyncQuery } from '@store/api/apiSlice';
import { setFlowState } from '@store/reducers/syncFlow';
import { RootState } from '@store/reducers';

import { getRouterPathname, isPublicSync } from '@utils/routes';
import { convertDurationToMinutesOrHours, getBaseRoute } from '@/utils/lib';
import { clearConnectionFlowState, setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import {
  getCatalogObjKey,
  getCredentialObjKey,
  getExtrasObjKey,
  getRunIntervalName,
  getScheduleObjKey,
  getSelectedConnectorKey,
  getSelectedConnectorObj
} from '@/utils/connectionFlowUtils';

const SyncDetails = ({ syncId, workspaceId }: any) => {
  const router = useRouter();

  const url = router.pathname;
  const query = router.query;

  const dispatch = useDispatch();

  const [traceError, setTraceError] = useState<any>(null);
  const [syncDetails, setSyncDetails] = useState(null);

  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const [getSyncDetails, { data, isFetching, isError, error }] = useLazyGetSyncByIdQuery();

  const [toggleSync, { data: updateSyncData }] = useLazyToggleSyncQuery();

  let publicSync = useMemo(() => isPublicSync(getRouterPathname(query, url)), [query, url]);

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

    if (!publicSync) {
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
        setTraceError(traceError);
      } else {
        setSyncDetails(data);
      }
    }
  }, [data]);

  const handleSyncSwitch = (event: React.ChangeEvent<HTMLInputElement>, val: any, syncData: any) => {
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
    const { id: connId = '', source = {}, destination = {}, schedule = {}, name: connName = '' } = data || {};

    const key = getSelectedConnectorKey();

    const { account = {}, connector_config = {}, name: sourceCredentialName = '', ...item } = source?.credential ?? {};

    const obj = getSelectedConnectorObj(item, key);

    const run_interval = getRunIntervalName(parseInt(schedule?.run_interval ?? 0));

    const objToDispatch = {
      ids: [key, getCredentialObjKey(obj.type), getCatalogObjKey(obj.type), getScheduleObjKey(), getExtrasObjKey()],
      entities: {
        [key]: getSelectedConnectorObj(item, key),
        [getCredentialObjKey(obj.type)]: {
          config: {
            ...connector_config,
            name: sourceCredentialName
          }
        },
        [getCatalogObjKey(obj.type)]: {
          streams: source?.catalog?.streams ?? []
        },
        [getScheduleObjKey()]: {
          run_interval: run_interval,
          name: connName
        },
        [getExtrasObjKey()]: {
          connId: connId,
          sourceId: source?.id ?? '',
          sourceName: source?.name ?? '',
          destinationId: destination?.id ?? '',
          destinationName: destination?.name ?? ''
        }
      }
    };

    const mode = item?.mode ?? [];

    dispatch(setConnectionFlowState(objToDispatch));

    const params = new URLSearchParams();

    params.set('mode', mode.length > 0 ? mode[0] : '');
    const pathname = `${getBaseRoute(workspaceId)}/connections/${connId}`;

    router.push(pathname + '?' + params);
  };

  const displayPageContent = (isPublicSync: boolean) => {
    return (
      <SyncDetailsCard
        syncData={syncDetails}
        handleSyncSwitch={handleSyncSwitch}
        handleEditSync={handleEditSync}
        isPublicSync={isPublicSync}
      />
    );
  };

  return (
    <Card variant="outlined">
      {/** Display Errors */}
      {isError && <ErrorComponent error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      <SkeletonLoader loading={isFetching} />

      {publicSync
        ? displayPageContent(publicSync)
        : !isError && !isFetching && syncDetails && displayPageContent(publicSync)}
    </Card>
  );
};

export default SyncDetails;
