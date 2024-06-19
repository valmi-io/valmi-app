import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { Card } from '@mui/material';

import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import ErrorComponent, { ErrorStatusText } from '@components/Error';
import SkeletonLoader from '@components/SkeletonLoader';

import { useLazyGetSyncByIdQuery, useLazyUpdateDataFlowStatusQuery } from '@store/api/apiSlice';
import { getBaseRoute } from '@/utils/lib';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import {
  getCatalogObjKey,
  getCredentialObjKey,
  getExtrasObjKey,
  getRunIntervalName,
  getScheduleObjKey,
  getSelectedConnectorKey,
  getSelectedConnectorObj
} from '@/utils/connectionFlowUtils';
import DataFlowDetailsCard from '@/content/DataFlowDetails/DataFlowDetailsCard';
import { TConnection } from '@/utils/typings.d';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { getRouterPathname, isPublicSync } from '@/utils/routes';

const DataflowDetails = ({ syncId }: { syncId: string }) => {
  const router = useRouter();

  const url = router.pathname;
  const query = router.query;
  const dispatch = useDispatch();

  const { workspaceId = '' } = useWorkspaceId();

  const [traceError, setTraceError] = useState<any>(null);
  const [dataFlowDetails, setDataFlowDetails] = useState<TConnection | null>(null);

  const [getDataFlow, { data, isLoading, error }] = useLazyGetSyncByIdQuery();

  const [updateDataFlowStatus, { data: updateSyncData }] = useLazyUpdateDataFlowStatusQuery();

  let publicSync = useMemo(() => isPublicSync(getRouterPathname(query, url)), [query, url]);

  useEffect(() => {
    if (updateSyncData) {
      if (!isPublicSync(getRouterPathname(query, url))) {
        const payload = {
          syncId: syncId,
          workspaceId: workspaceId
        };
        getDataFlow(payload);
      }
    }
  }, [updateSyncData, workspaceId]);

  useEffect(() => {
    if (!router.isReady) return;

    if (workspaceId && !publicSync) {
      const payload = {
        syncId: syncId,
        workspaceId: workspaceId
      };

      getDataFlow(payload);
    }
  }, [router.isReady, workspaceId]);

  useEffect(() => {
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setTraceError(traceError);
      } else {
        const { ids, entities } = data;
        const result = entities[ids[0]] ?? {};
        setDataFlowDetails(result);
      }
    }
  }, [data]);

  // Update dataflow status
  const handleSwitchOnChange = (event: React.ChangeEvent<HTMLInputElement>, val: any, syncData: any) => {
    event.stopPropagation();

    const payload = {
      config: {
        sync_id: syncData.id
      },
      enable: val,
      workspaceId: workspaceId
    };

    updateDataFlowStatus(payload);
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
          sourceId: source?.credential?.id ?? '',
          sourceName: source?.name ?? '',
          destinationId: destination?.credential?.id ?? '',
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

  const displayPageContent = (isPublicSync: boolean, dataFlowDetails: any) => {
    return (
      <DataFlowDetailsCard
        data={dataFlowDetails}
        handleSwitchOnChange={handleSwitchOnChange}
        handleEditSync={handleEditSync}
        isPublicSync={isPublicSync}
      />
    );
  };

  return (
    <Card variant="outlined">
      {/** Display Errors */}
      {error && <ErrorComponent error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      <SkeletonLoader loading={isLoading} />
      {publicSync
        ? displayPageContent(publicSync, dataFlowDetails)
        : !error && !isLoading && dataFlowDetails && displayPageContent(publicSync, dataFlowDetails)}
    </Card>
  );
};

export default DataflowDetails;
