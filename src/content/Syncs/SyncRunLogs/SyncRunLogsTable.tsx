// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, August 21st 2023, 11:33:57 am
 * Author: Nagendra S @ valmi.io
 */

import {
  Box,
  Button,
  Icon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled
} from '@mui/material';
import { TABLE_COLUMN_SIZES } from '../../../utils/table-utils';
import {
  SyncRunLogsTableProps,
  TableColumnProps,
  getMessageTimestamp,
  syncRunLogColumns
} from './SyncRunLogsUtils';
import { useState } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import Popup from '../../../components/Popup';

const CustomizedTableRow = styled(TableRow)<TableRowProps>(({}) => ({
  '& > *': {
    padding: '6px 12px',
    lineHeight: '1'
  },

  '&.MuiTableRow-hover:hover': {
    cursor: 'pointer'
  }
}));

const LogMessage = styled(Typography)(({}) => ({
  maxWidth: TABLE_COLUMN_SIZES[10],
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const SyncRunLogsTable = ({ syncRunLogs }: SyncRunLogsTableProps) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleRowHover = (rowData) => {
    //  Delay the dialog appearance by 300 milliseconds
    const timeDelay = 300; // milliseconds
    const timeout = setTimeout(() => {
      setSelectedRowData(rowData, null, 2);
      setCopied(false);
      setDialogOpen(true);
    }, timeDelay);

    // Store the timeout ID
    setHoverTimeout(timeout);
  };

  const handleCopyToClipboard = () => {
    if (selectedRowData) {
      setCopied(true);
      navigator.clipboard.writeText(JSON.stringify(selectedRowData));
    }
  };

  const handleCloseDialog = () => {
    // Clear the timeout if the mouse leaves before the delay
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    setDialogOpen(false);
  };

  // generate run logs columns
  const generateColumns = (columns: TableColumnProps[]) => {
    return columns.map((column) => {
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
    });
  };

  return (
    <>
      <TableContainer>
        <Table>
          {/* Sync Run Log Table Columns */}
          <TableHead>
            <TableRow>{generateColumns(syncRunLogColumns)}</TableRow>
          </TableHead>
          {/* Syncs Table Body */}
          <TableBody>
            {syncRunLogs &&
              syncRunLogs.length > 0 &&
              syncRunLogs.map((runLog: any, index: any) => {
                return (
                  <CustomizedTableRow hover key={`log_key ${index}`}>
                    <TableCell>
                      <Typography variant="body2">
                        {getMessageTimestamp(runLog.timestamp)}
                      </Typography>
                      {/* <Box>{getMessageTimestamp(runLog.timestamp)}</Box> */}
                    </TableCell>

                    <TableCell onMouseEnter={() => handleRowHover(runLog)}>
                      <LogMessage variant="body2">{runLog.message}</LogMessage>
                    </TableCell>
                  </CustomizedTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Popup
        open={isDialogOpen}
        onClose={handleCloseDialog}
        data={selectedRowData}
      >
        <Button
          variant="text"
          color="primary"
          style={{ alignSelf: 'end' }}
          onClick={handleCopyToClipboard}
          startIcon={<FileCopyIcon />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </Popup>
    </>
  );
};

export default SyncRunLogsTable;
