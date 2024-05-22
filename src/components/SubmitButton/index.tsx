/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
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
  color?: 'primary' | 'secondary' | 'error' | 'success';
  styles?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  buttonText,
  isFetching,
  data,
  ariaLabel = 'button',
  disabled = false,
  onClick,
  buttonType = 'button',
  fullWidth = false,
  color = 'primary',
  styles,
  size = 'large'
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
      color={color}
      size={size}
      endIcon={endIcon}
      onClick={onClick && onClick}
      style={styles}
    >
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
