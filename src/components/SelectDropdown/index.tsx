/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  CircularProgress,
  IconButton,
  InputLabel,
  Select,
  styled
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReactNode } from 'react';

type SelectDropdownProps = {
  label: string;
  hasError?: boolean;
  hasIconComponent?: boolean;
  isFetching?: boolean;
  value: any;
  disabled?: boolean;
  onChange: (event: any, data: any) => void;
  children?: ReactNode;
};

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body2
}));

const SelectDropdown = (props: SelectDropdownProps) => {
  const {
    label,
    hasError,
    hasIconComponent,
    isFetching,
    value,
    disabled,
    onChange,
    children
  } = props;

  return (
    <>
      {label !== '' && <Label id="label">{label}</Label>}
      {!hasError && (
        <Select
          disabled={disabled}
          labelId="label"
          id="select"
          fullWidth
          IconComponent={(props) => {
            return (
              <IconButton {...props} size="small">
                {hasIconComponent && isFetching ? (
                  <CircularProgress size={14} />
                ) : (
                  <ArrowDropDownIcon />
                )}
              </IconButton>
            );
          }}
          value={value}
          onChange={onChange}
        >
          {children}
        </Select>
      )}
    </>
  );
};

export default SelectDropdown;
