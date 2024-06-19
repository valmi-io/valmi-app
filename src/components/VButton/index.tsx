import React from 'react';
import { Button, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export interface VButtonProps {
  buttonText: string;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: any;
  buttonType?: 'submit' | 'button' | 'reset';
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'success';
  styles?: SxProps<Theme> | undefined;
  size?: 'small' | 'medium' | 'large';
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
}

const VButton: React.FC<VButtonProps> = ({
  buttonText,
  ariaLabel = 'button',
  disabled = false,
  onClick,
  buttonType = 'button',
  fullWidth = false,
  color = 'primary',
  styles,
  size = 'large',
  endIcon,
  startIcon,
  variant = 'contained'
}) => {
  return (
    <Button
      aria-label={ariaLabel}
      disabled={disabled}
      type={buttonType}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      size={size}
      endIcon={endIcon}
      startIcon={startIcon}
      onClick={onClick && onClick}
      sx={styles}
      disableElevation
    >
      {buttonText}
    </Button>
  );
};

export default VButton;
