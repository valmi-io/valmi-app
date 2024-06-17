/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 29th 2023, 11:49:41 am
 * Author: Nagendra S @ valmi.io
 */

import { Paper, Popover } from '@mui/material';
import React from 'react';

type PopoverProps = {
  onClose: () => void;
  anchorEl: any;
  children: React.ReactNode;
};

const PopoverComponent = (props: PopoverProps) => {
  const { onClose, anchorEl, children } = props;
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <Paper variant="outlined">{children}</Paper>
    </Popover>
  );
};

export default PopoverComponent;
