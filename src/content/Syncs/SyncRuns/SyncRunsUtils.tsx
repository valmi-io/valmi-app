// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 9:13:23 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '../../../components/Error/ErrorUtils';
import FontAwesomeIcon from '../../../components/Icon/FontAwesomeIcon';

export const getIcon = (type) => {
  let className = 'fa-circle-exclamation';
  if (type === 'success') {
    className = 'fa-check-circle';
  }
  return <FontAwesomeIcon className={`fas ${className}`} />;
};

export const getRunStatus = (syncRun) => {
  let runStatus = syncRun.status ? syncRun.status : 'status';

  // check if run_manager exists in syncrun object
  if (!checkIfRunManagerExists(syncRun)) return runStatus;

  return syncRun.extra.run_manager.status?.status || runStatus;
};

export const getErrorInSyncRun = (syncRun, connection) => {
  let syncError = 'UNKNOWN ERROR';

  // check if connection exists
  // if connection exists, return the error message produced by the connection

  if (connection) {
    const connectionStatus = syncRun.extra?.[connection]?.status;
    return connectionStatus?.message || syncError;
  }

  // check if run_manager exists in syncrun object
  if (!checkIfRunManagerExists(syncRun)) return syncError;

  return syncRun.extra.run_manager.status?.message || syncError;
};

export const getConnectionStatus = (syncRun, connection) => {
  let connectionStatus = syncRun.status || 'status';
  // check if run_manager exists in syncRun object
  if (checkIfRunManagerExists(syncRun)) {
    const runManagerStatus =
      syncRun.extra.run_manager.status.status || connectionStatus;

    // check if connection object exists in syncRun object
    // if exists, return connection object status, otherwise return run_manager status
    connectionStatus =
      syncRun.extra[connection]?.status?.status || runManagerStatus;
  }

  return connectionStatus;
};

export const checkIfRunManagerExists = (syncRun) => {
  if (
    !syncRun.extra ||
    !syncRun.extra.run_manager ||
    !syncRun.extra.run_manager.status
  )
    return false;
  return true;
};

export const getConnectionMetrics = (syncRun, connection) => {
  let connectionMetrics = [];
  if (!syncRun.metrics || !syncRun.metrics[connection]) {
    return connectionMetrics;
  }

  Object.entries(syncRun.metrics[connection]).forEach(([key, value]) => {
    key = key.split('$$')[0];
    connectionMetrics.push({
      key: key,
      value: value.value,
      display_order: value.display_order
    });
  });

  const sortedConnectionMetrics = connectionMetrics.sort((a, b) => {
    return a.display_order - b.display_order;
  });

  return sortedConnectionMetrics;
};

export const isSyncRunning = (syncRun) => {
  let runStatus = getRunStatus(syncRun);
  return runStatus === 'running' || runStatus === 'scheduled' ? true : false;
};

export const hasRunningSyncs = (syncRuns) => {
  const currentSyncRun = getCurrentSyncRun(syncRuns);
  let status = getRunStatus(currentSyncRun);
  if (status === 'scheduled' || status === 'running') return true;
  return false;
};

export const getCurrentSyncRun = (syncRuns) => {
  return syncRuns.length > 0 && syncRuns[0];
};

// sync run network handler
export const syncRunNetworkHandler = async (
  query,
  payload,
  responseHandler,
  errorHandler
) => {
  try {
    const data = await query(payload).unwrap();
    if (hasErrorsInData(data)) {
      const traceError = getErrorsInData(data);
      responseHandler(traceError, data);
    } else {
      responseHandler(null, data);
    }
    return;
  } catch (error) {
    const errors = getErrorsInErrorObject(error);
    const { message = 'unknown' } = errors || {};
    errorHandler(message);
    return;
  }
};

export const getPageButtonTitle = (isPublicSync, syncRuns, isQueryPending) => {
  if (isPublicSync) return 'LIVE DATA';
  return hasRunningSyncs(syncRuns)
    ? isQueryPending
      ? 'STOPPING...'
      : 'STOP SYNC'
    : isQueryPending
    ? 'STARTING...'
    : 'START SYNC';
};
