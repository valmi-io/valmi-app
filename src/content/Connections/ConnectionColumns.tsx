import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `Connection Columns`
 */

export const ConnectionColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Name',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.TITLE
  },
  {
    id: '2',
    label: 'Warehouse',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.SRC
  },
  { id: '3', label: '', minWidth: TABLE_COLUMN_SIZES[0] },
  {
    id: '4',
    label: 'Destination',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.DEST
  },
  {
    id: '5',
    label: 'Schedule',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.SCHEDULE
  },
  {
    id: '6',
    label: 'Status',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.STATUS,
    muiIcon: true
  },
  { id: '7', label: '', action: true, minWidth: TABLE_COLUMN_SIZES[0] }
];
