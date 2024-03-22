import { TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `destination columns`
 */

export const AnalyticsDestinationsTableColumns: TableColumnProps[] = [
  { id: '1', label: 'Name', minWidth: 300, icon: appIcons.NAME, muiIcon: true },
  { id: '2', label: 'Type', minWidth: 300, icon: 'CUSTOM' },
  { id: '3', label: 'NONE', align: 'right', action: true, minWidth: 100 }
];
