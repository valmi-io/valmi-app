import appIcons from '@utils/icon-utils';
import { TABLE_COLUMN_SIZES } from '@utils/table-utils';

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
  collector: 'src' | 'dest';
  since?: number | null;
  before?: number | null;
};

export type SyncRunLogsTableProps = {
  syncRunLogs: any;
};

export interface TableColumnProps {
  id: string;
  label: string;
  icon?: any;
  action?: boolean | false;
  minWidth?: number;
  align?: 'right' | 'center';
}

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

export const generatePayload = (logPayload: LogPayloadIn) => {
  const { props, since, before } = logPayload;
  const { syncId, runId, connectionType, workspaceId } = props;

  const payload: LogPayload = {
    syncId,
    runId,
    collector: connectionType,
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

export const generateLogMessages = (sinces: any, lines: any) => {
  let messages: any = [];

  sinces.forEach((item: any) => {
    const logsArr = lines[item];
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

export const generateLogsObject = (since: string, logs: []) => {
  let modifiedLogsObj: any = {};

  modifiedLogsObj[since] = logs;
  return modifiedLogsObj;
};

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
