/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 8:57:12 pm
 * Author: Nagendra S @ valmi.io
 */

import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `syncRunColumns`
 */

export const SyncRunColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Warehouse',
    minWidth: TABLE_COLUMN_SIZES[4],
    icon: appIcons.SRC
  },
  { id: '2', label: '', minWidth: TABLE_COLUMN_SIZES[1] },
  {
    id: '3',
    label: 'Destination',
    minWidth: TABLE_COLUMN_SIZES[4],
    icon: appIcons.DEST
  },
  {
    id: '4',
    label: 'Started_at',
    minWidth: TABLE_COLUMN_SIZES[3],
    icon: appIcons.STARTED_AT
  },
  {
    id: '5',
    label: 'Status',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.STATUS,
    muiIcon: true
  }
];
