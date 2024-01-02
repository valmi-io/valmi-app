/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Sunday, December 24th 2023, 7:56:30 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { Icon, Stack, TableCell, TableRow, useTheme } from '@mui/material';
import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';
import { TableColumnProps } from '@utils/table-utils';
import appIcons, { IAppIcons } from '@utils/icon-utils';

type TTableHeaderProps = {
  columns: TableColumnProps[];
  connectionType?: string;
};

/**
 * Responsible for rendering Table header.
 */

const TableHeader = ({ columns, connectionType = '' }: TTableHeaderProps) => {
  const theme = useTheme();
  return (
    <TableRow>
      {columns.map((column: any) => {
        return (
          <TableCell key={column.id} align={column.align}>
            <Stack direction="row" alignItems="center">
              {column.icon &&
                (column.muiIcon ? (
                  <Icon sx={{ marginRight: (theme) => theme.spacing(1) }}>{column.icon}</Icon>
                ) : (
                  <FontAwesomeIcon
                    icon={column.icon === 'CUSTOM' ? appIcons[connectionType as keyof IAppIcons] : column.icon}
                    style={{ marginRight: theme.spacing(1) }}
                  />
                ))}
              {column.label}
            </Stack>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default TableHeader;
