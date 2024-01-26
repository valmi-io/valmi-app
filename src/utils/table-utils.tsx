/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 17th 2023, 9:07:01 pm
 * Author: Nagendra S @ valmi.io
 */

export interface TableColumnProps {
  id: string;
  label: string;
  icon?: any;
  action?: boolean | false;
  minWidth?: number;
  align?: 'right' | 'center';
  muiIcon?: boolean;
}

export const TABLE_COLUMN_SIZES = {
  0: 50,
  1: 100,
  2: 150,
  3: 200,
  4: 250,
  5: 300,
  6: 350,
  7: 400,
  8: 450,
  9: 500,
  10: 550
};
