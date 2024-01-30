/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  styled
} from '@mui/material';

import dynamic from 'next/dynamic';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { blackColor } from '@/theme/schemes/AppFlowyTheme';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import { CustomizedTableRow } from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import { isObject } from '@/utils/lib';

type PopupProps = {
  open: boolean;
  data?: any;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
  copy?: boolean;
  isCopied?: boolean;
  handleCopy?: (data: any) => void;
};

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

const BackIcon = styled(Icon)(({ theme }) => ({
  display: 'flex',
  marginRight: theme.spacing(1),
  color: blackColor,
  cursor: 'pointer',
  justifyContent: 'center',
  alignItems: 'center'
}));

const StackLayout = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const Modal = (props: PopupProps) => {
  const { open, onClose, title, data, children, handleCopy, copy, isCopied } = props;

  const dataEntries = Object.entries(data ?? {});

  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: 300,
            sm: 400,
            md: 700
          }
        }
      }}
    >
      <StackLayout>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <BackIcon onClick={onClose}>
            <CustomIcon icon={appIcons.ARROW_LEFT} />
          </BackIcon>
          {title && <Typography variant="body1">{title}</Typography>}
        </Box>
        {copy && (
          <Button size="small" variant="outlined" color="primary" onClick={handleCopy} startIcon={<FileCopyIcon />}>
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </StackLayout>
      <Divider />

      <TableContainer component={Paper}>
        <Table size="small">
          {/* Live events Body */}
          <TableBody>
            {dataEntries.map(([key, value]) => {
              return (
                <CustomizedTableRow key={`log_key ${key}`}>
                  <TableCell>
                    <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      {isObject(value) ? (
                        <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                          <Typography variant="subtitle1">{`${key}:`}</Typography>
                          <DynamicReactJson
                            name={false}
                            src={value ?? {}}
                            enableClipboard={false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            collapsed={false}
                          />
                        </Stack>
                      ) : (
                        <>
                          <Typography variant="subtitle1">{`${key}:`}</Typography>
                          <Typography sx={{ fontWeight: 500 }} variant="subtitle2">{`${value}`}</Typography>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </CustomizedTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {children && children}
    </Drawer>
  );
};

export default Modal;
