/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 9:42:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { Alert, Snackbar, Stack, Typography } from '@mui/material';

export interface AlertComponentProps {
  open: boolean;
  onClose: () => void;
  message: string;
  displayButton?: boolean;
  onButtonClick?: () => void;
  isError?: boolean;
}

const AlertComponent = ({
  open,
  onClose,
  message,
  displayButton = false,
  onButtonClick,
  isError
}: AlertComponentProps) => {
  const displayAlertMessage = () => {
    return (
      <>
        {message}
        {displayButton && (
          <Stack>
            <Typography variant="body2" color="text.error">
              If user is not activated,{' '}
              <span
                onClick={onButtonClick}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                resend activation link
              </span>
              <span>{'.'}</span>
            </Typography>
          </Stack>
        )}
      </>
    );
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={null}
      onClose={onClose}
      sx={{
        alignItems: 'center'
      }}
    >
      <Alert
        onClose={onClose}
        severity={isError ? 'error' : 'success'}
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {displayAlertMessage()}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
