import { TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `stream columns`
 */

export const StreamTableColumns: TableColumnProps[] = [
  { id: '1', label: 'Name', minWidth: 300, icon: appIcons.TITLE },
  { id: '2', label: 'Type', minWidth: 300, icon: appIcons.STREAM },
  { id: '3', label: '', align: 'right', action: true, minWidth: 50 },
  { id: '4', label: '', align: 'right', action: true, minWidth: 50 }
];
