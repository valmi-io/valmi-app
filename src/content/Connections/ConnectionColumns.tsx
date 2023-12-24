/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, November 15th 2023, 2:07:13 pm
 * Author: Nagendra S @ valmi.io
 */

import { TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `connection columns`
 */

export const ConnectionColumns: TableColumnProps[] = [
  { id: '1', label: 'Name', minWidth: 300, icon: appIcons.NAME, muiIcon: true },
  { id: '2', label: 'Account', minWidth: 300, icon: appIcons.ACCOUNT },
  { id: '3', label: 'Connector', minWidth: 300, icon: 'CUSTOM' },
  { id: '4', label: '', align: 'right', action: true, minWidth: 100 }
];
