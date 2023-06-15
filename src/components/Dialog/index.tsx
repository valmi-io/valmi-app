/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 16th 2023, 7:27:22 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';

type DialogComponentProps = {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

const DialogComponent = (props: DialogComponentProps) => {
  const { open, handleClose, children } = props;

  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Dialog>
    </>
  );
};

export default DialogComponent;
