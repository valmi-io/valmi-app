/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 4:09:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';

type FormFieldPasswordProps = {
  field?: any;
  description?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: any;
  value?: any;
  onChange?: any;
};

const FormFieldPassword = (props: FormFieldPasswordProps) => {
  const {
    field,
    description,
    label,
    required,
    disabled,
    error,
    value,
    onChange
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <Tooltip title={description ? description : ''} placement="top-start">
      <TextField
        {...field}
        required={required}
        disabled={disabled}
        fullWidth
        label={label}
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        error={error}
        value={value}
        onChange={onChange}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Tooltip>
  );
};

export default FormFieldPassword;
