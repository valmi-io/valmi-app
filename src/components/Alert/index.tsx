/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 9:42:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { Alert, Snackbar } from '@mui/material';

export interface AlertComponentProps {
  open: boolean;
  onClose: () => void;
  message: string;
  isError?: boolean;
}

const AlertComponent = ({
  open,
  onClose,
  message,
  isError
}: AlertComponentProps) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={null}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={isError ? 'error' : 'success'}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
