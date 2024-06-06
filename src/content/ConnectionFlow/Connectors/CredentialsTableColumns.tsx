import { TABLE_COLUMN_SIZES, TableColumnProps } from '@utils/table-utils';
import appIcons from '@utils/icon-utils';

/**
 * Responsible for generating `credentialsColumns`
 */

//TODO : FINALIZE AND MODIFY COLUMN NAMES, ICONS

export const CredentialsColumns: TableColumnProps[] = [
  {
    id: '1',
    label: 'NAME',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.TITLE,
    muiIcon: false
  },
  {
    id: '2',
    label: 'ACCOUNT',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.ACCOUNT
  },
  {
    id: '4',
    label: 'CONNECTOR',
    minWidth: TABLE_COLUMN_SIZES[2],
    icon: appIcons.SRC
  },

  { id: '5', label: '', action: true, minWidth: TABLE_COLUMN_SIZES[0] }
];
