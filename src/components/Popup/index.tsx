/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { blackColor } from '@theme/schemes/AppFlowyTheme';

type PopupProps = {
  open: boolean;
  data?: any;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Popup = (props: PopupProps) => {
  const { open, onClose, title, data, children } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <code style={{ color: blackColor }}>{JSON.stringify(data, null, 4)}</code>
      {children}
    </Dialog>
  );
};

export default Popup;
