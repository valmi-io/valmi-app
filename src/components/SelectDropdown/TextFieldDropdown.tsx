/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 4:44:04 pm
 * Author: Nagendra S @ valmi.io
 */

import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent } from 'react';

type TextFieldDropdownProps = {
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  primaryKey: string;
  data?: any[];
  dataNormalized?: {
    ids: string[];
    entities: any;
  };
};

const TextFieldDropdown = ({
  primaryKey = '',
  data = [],
  dataNormalized,
  label = '',
  required,
  fullWidth,
  disabled,
  value,
  onChange
}: TextFieldDropdownProps) => {
  return (
    <TextField
      id={label}
      label={label}
      select={true}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      value={value}
      onChange={onChange}
      InputLabelProps={{
        shrink: true
      }}
    >
      {dataNormalized &&
        dataNormalized.ids.map((id) => {
          return (
            <MenuItem key={id} value={id}>
              {dataNormalized.entities[id][primaryKey] ?? id}
            </MenuItem>
          );
        })}
      {!dataNormalized &&
        data.map((item) => {
          return (
            <MenuItem key={item} value={item}>
              {item[primaryKey] ?? item}
            </MenuItem>
          );
        })}
    </TextField>
  );
};

export default TextFieldDropdown;
