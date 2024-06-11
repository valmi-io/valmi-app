import React from 'react';
import { CheckOutlined } from '@mui/icons-material';
import { Button, CircularProgress, SxProps } from '@mui/material';
import VButton, { VButtonProps } from '@/components/VButton';

interface SubmitButtonProps extends VButtonProps {
  isFetching: boolean;
  data: any;
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
  endIcon = isFetching && <CircularProgress size={14} sx={{ color: 'white' }} />;
  if (data) {
    endIcon = <CheckOutlined fontSize="small" />;
  }

  return (
    <VButton
      aria-label={ariaLabel}
      disabled={disabled}
      buttonType={buttonType}
      fullWidth={fullWidth}
      variant="contained"
      color={color}
      size={size}
      endIcon={endIcon}
      onClick={onClick && onClick}
      styles={styles}
      buttonText={buttonText}
    />
  );
};

export default SubmitButton;
