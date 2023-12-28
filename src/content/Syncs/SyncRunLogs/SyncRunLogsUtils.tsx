/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, August 21st 2023, 1:40:45 pm
 * Author: Nagendra S @ valmi.io
 */

import appIcons from '@utils/icon-utils';
import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';

export type LogsType = { [key: string]: any };

export type SyncRunLogProps = {
  syncId: string;
  runId: string;
  workspaceId: string;
  connectionType: 'src' | 'dest';
};

export type LogPayloadIn = {
  since?: number | null;
  before?: number | null;
  props: SyncRunLogProps;
};

export type LogPayload = {
  syncId: string;
  workspaceId: string;
  runId: string;
  connector: 'src' | 'dest';
  since?: number | null;
  before?: number | null;
};

export type SyncRunLogsTableProps = {
  syncRunLogs: any;
};

/**
 * Generates SyncRunLogColums
 * @returns SyncRunLogColumns.
 */
export const syncRunLogColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Timestamp',
    icon: appIcons.TIME,
    minWidth: TABLE_COLUMN_SIZES[1]
  },
  {
    id: '2',
    label: 'Message',
    icon: appIcons.MESSAGE,
    minWidth: TABLE_COLUMN_SIZES[4]
  }
];

/**
 * Generates log payload
 * @param{LogPayloadIn} logPayload
 * @returns logPayload
 */
export const generateLogPayload = (logPayload: LogPayloadIn) => {
  const { props, since, before } = logPayload;

  const { syncId, runId, connectionType, workspaceId } = props;

  const payload: LogPayload = {
    syncId,
    runId,
    connector: connectionType,
    workspaceId
  };

  if (since) {
    payload.since = since;
  }

  if (before) {
    payload.before = before;
  }

  return payload;
};

/**
 * Generates log Messages
 * @param sinces
 * @param logs
 * @returns log Messages
 */
export const generateLogMessages = (sinces: any, logs: any) => {
  let messages: any = [];

  sinces.forEach((item: any) => {
    const logsArr = logs[item];
    logsArr.forEach((log: any) => {
      const modifiedLog = {
        timestamp: log[0],
        message: log[1]
      };

      messages.push(modifiedLog);
    });
  });

  return messages;
};

/**
 * Generates logs Object
 * @param since
 * @param logs
 * @returns logs object
 */
export const generateLogsObject = (since: string, logs: []) => {
  let modifiedLogsObj: any = {};

  modifiedLogsObj[since] = logs;
  return modifiedLogsObj;
};

/**
 * Formats log message timestamp
 * @param timestamp
 * @returns messageTimeStamp
 */
export const getMessageTimestamp = (timestamp: any): string => {
  // Convert timestamp(microseconds) to milliseconds
  const timestampInMilliseconds = timestamp / 1000;

  // Create a new Date object
  const messageTimestamp: Date = new Date(timestampInMilliseconds);

  const formattedTimestamp =
    messageTimestamp.toDateString() +
    ' ' +
    messageTimestamp.getHours().toString().padStart(2, '0') +
    ':' +
    messageTimestamp.getMinutes().toString().padStart(2, '0');

  return formattedTimestamp;
};
