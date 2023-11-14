/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
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
  return (
    <Popover
      anchorEl={anchorEl}
      onClose={onClose}
      open={Boolean(anchorEl)}
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
