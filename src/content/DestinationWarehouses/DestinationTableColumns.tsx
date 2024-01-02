/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 2nd 2024, 12:50:52 pm
 * Author: Nagendra S @ valmi.io
 */

import { TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `destination columns`
 */

export const DestinationTableColumns: TableColumnProps[] = [
  { id: '1', label: 'Name', minWidth: 300, icon: appIcons.NAME, muiIcon: true },
  { id: '2', label: 'Type', minWidth: 300, icon: 'CUSTOM' },
  { id: '3', label: '', align: 'right', action: true, minWidth: 100 }
];
