/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 17th 2023, 8:53:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Checkbox, IconButton, MenuItem, TableCell, Tooltip, Typography } from '@mui/material';

import ImageComponent, { ImageComponentProps } from '@components/ImageComponent';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import SelectDropdown from '@/components/SelectDropdown';
import { isArray } from '@/utils/lib';

interface TableCellProps {
  text: string;
}

interface TableCellWithImageProps extends ImageComponentProps {}

interface TableCellWithActionButtonProps {
  tooltip: string;
  onClick: () => void;
  style?: React.CSSProperties;
  align?: 'center' | 'right' | 'left';
  actionType?: 'EDIT' | 'LIVE_EVENTS';
}

interface TableCellWithSwitchProps {
  onClick: (event: any, checked: boolean) => void;
  style?: React.CSSProperties;
  align?: 'center' | 'right' | 'left';
  checked: boolean;
  labelId?: string;
}

interface TableCellWithDropdownProps {
  onClick: (event: any, checked: boolean) => void;
  style?: React.CSSProperties;
  align?: 'center' | 'right' | 'left';
  label?: string;
  value: string;
  data: any;
  disabled?: boolean;
}

export const TableCellComponent = ({ text }: TableCellProps) => {
  return (
    <TableCell>
      <Typography variant="body2" color="text.primary" noWrap>
        {text}
      </Typography>
    </TableCell>
  );
};

export const TableCellWithImage = ({ size, src, alt, title }: TableCellWithImageProps) => {
  return (
    <TableCell>
      <ImageComponent size={size} src={src} alt={alt ? alt : 'icon'} style={{ marginRight: '10px' }} title={title} />
    </TableCell>
  );
};

export const TableCellWithActionButton = ({
  tooltip,
  onClick,
  style,
  align = 'center',
  actionType = 'EDIT'
}: TableCellWithActionButtonProps) => {
  return (
    <TableCell align={align} style={style}>
      <Tooltip title={tooltip}>
        <IconButton
          sx={{
            '&:hover': {
              background: (theme) => theme.colors.primary.lighter
            },
            color: (theme) => theme.palette.secondary.main
          }}
          color="inherit"
          size="small"
          onClick={onClick}
        >
          <CustomIcon icon={appIcons[actionType]} />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
};

export const TableCellWithSwitch = ({ onClick, align, style, checked, labelId = '' }: TableCellWithSwitchProps) => {
  return (
    <TableCell>
      <Checkbox
        color="primary"
        checked={checked}
        onChange={(event, checked) => {
          onClick(event, checked);
        }}
        inputProps={{
          'aria-labelledby': labelId
        }}
      />
    </TableCell>
  );
};

export const TableCellWithDropdown = ({
  label = '',
  value,
  onClick,
  data,
  disabled = false
}: TableCellWithDropdownProps) => {
  return (
    <TableCell>
      <SelectDropdown
        disabled={disabled}
        label={label}
        value={value}
        onChange={(event, key) => {
          onClick(event, key);
        }}
        size="small"
      >
        {isArray(data) &&
          data.map((option: any, index: string) => {
            return (
              <MenuItem key={'_valkey' + index} value={option}>
                {option}
              </MenuItem>
            );
          })}
      </SelectDropdown>
    </TableCell>
  );
};
