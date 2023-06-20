/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, IconButton, Stack, Tooltip, styled } from '@mui/material';
import { ReactNode } from 'react';

import SelectDropdown from '.';

import FormFieldText from '../FormInput/FormFieldText';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

const BoxLayout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  width: '100%'
}));

const StackLayout = styled(Stack)(({ theme }) => ({
  ...theme.typography.body2,
  marginBottom: theme.spacing(2)
}));

type DualSelectDropdownProps = {
  labelLeft: string;
  hasErrorLeft?: boolean;
  hasIconComponentLeft?: boolean;
  isFetchingLeft?: boolean;
  valueLeft: any;
  disabledLeft?: boolean;
  onChangeLeft: (event: any, data: any) => void;
  childrenLeft?: ReactNode;

  childrenRight?: ReactNode;
  fieldType?: string;
  labelRight: string;
  hasErrorRight?: boolean;
  hasIconComponentRight?: boolean;
  isFetchingRight?: boolean;
  valueRight: any;
  disabledRight?: boolean;
  onChangeRight: (event: any, data: any) => void;

  displayDeleteIcon?: boolean;
  onDeleteIconClick?: (data: any) => void;
};

const DualSelectDropdown = (props: DualSelectDropdownProps) => {
  const {
    labelLeft,
    hasErrorLeft,
    hasIconComponentLeft,
    isFetchingLeft,
    valueLeft,
    disabledLeft,
    onChangeLeft,
    childrenLeft,
    childrenRight,
    fieldType = 'dropdown',
    labelRight,
    hasErrorRight,
    hasIconComponentRight,
    isFetchingRight,
    valueRight,
    disabledRight,
    onChangeRight,
    displayDeleteIcon,
    onDeleteIconClick
  } = props;

  return (
    <StackLayout direction="row" alignItems="center" justifyContent="center">
      <BoxLayout>
        <SelectDropdown
          label={labelLeft}
          disabled={disabledLeft}
          value={valueLeft}
          onChange={onChangeLeft}
          hasError={hasErrorLeft}
          hasIconComponent={hasIconComponentLeft}
          isFetching={isFetchingLeft}
        >
          {childrenLeft}
        </SelectDropdown>
      </BoxLayout>

      <ArrowForwardIcon
        style={{ fontSize: 18, marginLeft: 2, marginRight: 2 }}
      />
      <BoxLayout>
        {fieldType === 'dropdown' && (
          <SelectDropdown
            label={labelRight}
            disabled={disabledRight}
            value={valueRight}
            onChange={onChangeRight}
            hasError={hasErrorRight}
            hasIconComponent={hasIconComponentRight}
            isFetching={isFetchingRight}
          >
            {childrenRight}
          </SelectDropdown>
        )}
        {fieldType === 'free' && (
          <FormFieldText
            field={{}}
            description={''}
            fullWidth={true}
            label={labelRight}
            type="text"
            required={true}
            error={false}
            value={valueRight}
            onChange={onChangeRight}
          />
        )}
      </BoxLayout>
      {fieldType === 'free' && (
        <Tooltip
          title={'This field will be created in destination'}
          placement="top-start"
        >
          <InfoIcon style={{ marginLeft: 2, marginRight: 2 }} />
        </Tooltip>
      )}

      {displayDeleteIcon && (
        <IconButton color="inherit" onClick={onDeleteIconClick}>
          <CloseIcon />
        </IconButton>
      )}
    </StackLayout>
  );
};

export default DualSelectDropdown;
