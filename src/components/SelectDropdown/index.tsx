/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { Button, CircularProgress, IconButton, InputLabel, Select, Stack, styled } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReactNode } from 'react';

type SelectDropdownProps = {
  label: string;
  hasError?: boolean;
  hasIconComponent?: boolean;
  isFetching?: boolean;
  value: any;
  disabled?: boolean;
  allowCreateButton?: boolean;
  handleCreateClick?: () => void;
  onChange: (event: any, data: any) => void;
  isCreating?: boolean;
  children?: ReactNode;
  size?: 'medium' | 'small';
};

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body2
}));

const CreateButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  maxWidth: 'fit-content',
  alignSelf: 'flex-end'
}));

const SelectDropdown = (props: SelectDropdownProps) => {
  const {
    label,
    hasError,
    hasIconComponent,
    isFetching,
    value,
    disabled,
    allowCreateButton,
    handleCreateClick,
    isCreating,
    onChange,
    children,
    size = 'medium'
  } = props;

  return (
    <>
      <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
        <Stack>{label !== '' && <Label id="label">{label}</Label>}</Stack>
        {allowCreateButton && (
          <CreateButton variant="text" onClick={handleCreateClick}>
            {isCreating ? 'Close' : '+ Create'}
          </CreateButton>
        )}
      </Stack>
      {!hasError && (
        <Select
          disabled={disabled}
          labelId="label"
          id="select"
          fullWidth
          size={size}
          IconComponent={(props) => {
            return (
              <IconButton {...props} size="small">
                {hasIconComponent && isFetching ? <CircularProgress size={14} /> : <ArrowDropDownIcon />}
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
