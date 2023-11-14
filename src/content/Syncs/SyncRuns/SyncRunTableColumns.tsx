/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 8:59:04 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { Icon, Stack, TableCell, TableRow } from '@mui/material';

interface SyncRunTableColumnProps {
  columns: any;
}

/**
 * Responsible for rendering `sync run` columns.
 */

const SyncRunTableColumns = ({ columns }: SyncRunTableColumnProps) => {
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

export default SyncRunTableColumns;
