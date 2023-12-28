/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, December 28th 2023, 9:06:41 am
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useMemo, useState } from 'react';
import { useSyncRunLogs } from './useSyncRunLogs';
import {
  LogPayloadIn,
  LogsType,
  generateLogMessages,
  generateLogsObject
} from './SyncRunLogsUtils';
import { isObjectEmpty } from '@utils/lib';

interface IUseFilteredSyncRunLogProps extends LogPayloadIn {}

export const useFilteredSyncRunLogs = (props: IUseFilteredSyncRunLogProps) => {
  const { since, props: logProps } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sinces, setSinces] = useState<string[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogsType>({});
  const {
    data: logsData,
    error,
    traceError,
    fetchLogs
  } = useSyncRunLogs({ since, props: logProps });

  useEffect(() => {
    if (logsData) {
      handleLogsData(logsData);
    }
  }, [logsData]);

  useEffect(() => {
    if (error || traceError) {
      setIsLoading(false);
    }
  }, [error, traceError]);

  /**
   * Checks if since exists in SincesArray
   * @param sincesArray
   * @param since
   * @returns true | false
   */
  const isSinceExistsInArray = (sincesArray: any, since: any): boolean => {
    return sincesArray.indexOf(since) === -1 ? false : true;
  };

  const handleLogsData = (logsData: any) => {
    const { meta = {}, logs = [] } = logsData ?? {};
    const { since, before } = meta;

    if (!since) {
      // Generate the new payload with updated since property.
      // If before is null, since = -1
      fetchLogs({ since: before ?? -1, props: logProps });
    } else {
      // Append since, if not existed in existing sinces array.
      if (!isSinceExistsInArray(sinces, since)) {
        setSinces((prevSinces) => [...prevSinces, since]);
      }

      // Generate the logs object.
      const generatedLogsObject = generateLogsObject(since, logs);

      // Update the setLogs state with the new generatedLogs.
      setFilteredLogs((prevLogs) => ({
        ...prevLogs,
        ...generatedLogsObject
      }));
    }
  };

  const filteredLogsData = useMemo(() => {
    if (!isObjectEmpty(filteredLogs)) {
      // Generate log messages for display.
      const messages = generateLogMessages(sinces, filteredLogs);
      setIsLoading(false);
      return messages;
    }
  }, [filteredLogs]);

  /**
   *  Handles fetching more logs when a button is clicked.
   *  @param logData
   */
  const handleFetchMore = () => {
    const { meta = {} } = logsData;
    const { since, before } = meta;

    let sinceVal = since;
    if (before) {
      sinceVal = before;
    }

    // Generate the new payload with updated since.
    fetchLogs({ since: sinceVal, props: logProps });
  };

  return {
    filteredLogsData,
    isLoading,
    error,
    traceError,
    handleFetchMore
  };
};
