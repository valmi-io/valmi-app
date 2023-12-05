/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, November 15th 2023, 2:02:27 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { FC } from 'react';
import { Icon, Stack, TableCell, TableRow } from '@mui/material';
import appIcons, { IAppIcons } from '../../utils/icon-utils';

interface ConnectionTableColumnProps {
  columns: any;
  connectionType: string;
}

/**
 * Responsible for rendering `connection` columns.
 */

const ConnectionTableColumns: FC<ConnectionTableColumnProps> = ({
  columns,
  connectionType
}) => {
  return (
    <TableRow>
      {columns.map((column: any) => {
        return (
          <TableCell key={column.id} align={column.align}>
            <Stack direction="row" alignItems="center">
              {column.icon && (
                <Icon sx={{ marginRight: (theme) => theme.spacing(1) }}>
                  {column.icon === 'CUSTOM'
                    ? appIcons[connectionType as keyof IAppIcons]
                    : column.icon}
                </Icon>
              )}
              {column.label}
            </Stack>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default ConnectionTableColumns;
