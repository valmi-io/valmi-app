/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, November 9th 2023, 4:08:45 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { Icon, Stack, TableCell, TableRow } from '@mui/material';

interface SyncTableColumnProps {
  columns: any;
}

/**
 * Responsible for rendering `sync` columns.
 */

const SyncTableColumns = ({ columns }: SyncTableColumnProps) => {
  return (
    <TableRow>
      {columns.map((column: any) => {
        return (
          <TableCell
            key={column.id}
            align={column.align}
            style={{
              minWidth: column.minWidth
            }}
          >
            <Stack direction="row" alignItems="center">
              {column.icon && (
                <Icon sx={{ marginRight: (theme) => theme.spacing(1) }}>
                  {column.icon}
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

export default SyncTableColumns;
