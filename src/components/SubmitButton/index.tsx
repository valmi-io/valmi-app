/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, January 1st 2024, 12:35:15 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { CheckOutlined } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
  buttonText: string;
  isFetching: boolean;
  data: any;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: 'submit' | 'button' | 'reset';
  fullWidth?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  buttonText,
  isFetching,
  data,
  ariaLabel = 'button',
  disabled = false,
  onClick,
  buttonType = 'button',
  fullWidth = false
}) => {
  let endIcon = null;
  endIcon = isFetching && <CircularProgress size={16} sx={{ color: 'white' }} />;
  if (data) {
    endIcon = <CheckOutlined fontSize="small" />;
  }

  return (
    <Button
      aria-label={ariaLabel}
      disabled={disabled}
      type={buttonType}
      fullWidth={fullWidth}
      variant="contained"
      color="primary"
      size="large"
      endIcon={endIcon}
      sx={{ mt: 2 }}
      onClick={onClick && onClick}
    >
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
