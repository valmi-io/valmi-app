/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 10th 2024, 10:52:28 am
 * Author: Nagendra S @ valmi.io
 */

import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `Event connections columns`
 */

export const EventConnectionsTableColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Stream',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.SRC
  },
  {
    id: '2',
    label: 'Destination',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.DEST
  },

  { id: '3', label: '', action: true, minWidth: TABLE_COLUMN_SIZES[0] }
];
