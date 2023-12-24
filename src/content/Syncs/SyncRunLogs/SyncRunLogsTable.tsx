//@ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, August 21st 2023, 11:33:57 am
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableRowProps,
  Typography,
  styled
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import {
  SyncRunLogsTableProps,
  getMessageTimestamp,
  syncRunLogColumns
} from '@content/Syncs/SyncRunLogs/SyncRunLogsUtils';

import Popup from '@components/Popup';

import { TABLE_COLUMN_SIZES } from '@utils/table-utils';
import TableHeader from '@components/Table/TableHeader';

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
  const [selectedRowData, setSelectedRowData] = useState<unknown>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleRowOnClick = (rowData: any) => {
    setSelectedRowData(rowData, null, 2);
    setCopied(false);
    setDialogOpen(true);
  };

  const handleCopyToClipboard = () => {
    if (selectedRowData) {
      setCopied(true);
      navigator.clipboard.writeText(JSON.stringify(selectedRowData));
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TableContainer>
        <Table>
          {/* Logs Table Columns */}
          <TableHead>
            <TableHeader columns={syncRunLogColumns} />
          </TableHead>
          {/* Logs Table Body */}
          <TableBody>
            {syncRunLogs &&
              syncRunLogs.length > 0 &&
              syncRunLogs.map((runLog: any, index: any) => {
                return (
                  <CustomizedTableRow
                    onClick={() => handleRowOnClick(runLog)}
                    hover
                    key={`log_key ${index}`}
                  >
                    <TableCell>
                      <Typography variant="subtitle1">
                        {getMessageTimestamp(runLog.timestamp)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <LogMessage variant="subtitle1">
                        {runLog.message}
                      </LogMessage>
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
