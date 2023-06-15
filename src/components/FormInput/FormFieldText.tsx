/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 4:01:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { MenuItem, TextField, Tooltip } from '@mui/material';

type FormFieldTextProps = {
  field?: any;
  description?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  select?: boolean;
  error?: any;
  values?: any;
  fullWidth?: boolean;
  type?: any;
  value?: any;
  mulitline?: boolean;
  onChange?: any;
};
const FormFieldText = (props: FormFieldTextProps) => {
  const {
    field,
    description,
    select,
    values,
    label,
    required,
    disabled,
    error,
    type,
    value,
    mulitline,
    fullWidth = false,
    onChange
  } = props;

  const inputProps =
    type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {};

  return (
    <Tooltip title={description ? description : ''} placement="top-start">
      <TextField
        {...field}
        fullWidth={fullWidth}
        label={label}
        type={type}
        select={select}
        required={required}
        disabled={disabled}
        error={error}
        value={value}
        multiline={mulitline}
        onChange={onChange}
        InputLabelProps={{
          shrink: true
        }}
        inputProps={inputProps}
      >
        {select &&
          values.map((option: any) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
    </Tooltip>
  );
};

export default FormFieldText;
