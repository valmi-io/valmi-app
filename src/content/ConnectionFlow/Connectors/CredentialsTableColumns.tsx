import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `credentialsColumns`
 */

//TODO : FINALIZE AND MODIFY COLUMN NAMES, ICONS

export const CredentialsColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'Name',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.NAME,
    muiIcon: true
  },
  {
    id: '2',
    label: 'SHOP',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.SRC
  },
  { id: '3', label: '', minWidth: TABLE_COLUMN_SIZES[0] },
  {
    id: '4',
    label: 'TYPE',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.DEST
  },

  {
    id: '5',
    label: 'Status',
    minWidth: TABLE_COLUMN_SIZES[0],
    icon: appIcons.STATUS,
    muiIcon: true
  },
  { id: '6', label: '', action: true, minWidth: TABLE_COLUMN_SIZES[0] }
];
