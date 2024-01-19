/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import Dialog from '@mui/material/Dialog';

import { Box, Button, Divider, Icon, Stack, Typography, styled, useTheme } from '@mui/material';

import dynamic from 'next/dynamic';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { blackColor } from '@/theme/schemes/AppFlowyTheme';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

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

const Layout = styled(Box)(({}) => ({
  minHeight: 300,
  minWidth: 300
}));

const StackLayout = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const Modal = (props: PopupProps) => {
  const theme = useTheme();
  const { open, onClose, title, data, children, handleCopy, copy, isCopied } = props;

  return (
    <BootstrapDialog onClose={onClose} open={open}>
      <Layout>
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

        <DynamicReactJson style={{ padding: theme.spacing(2) }} src={data} collapsed={false} enableClipboard={false} />
      </Layout>
      {children && children}
    </BootstrapDialog>
  );
};

export default Modal;
