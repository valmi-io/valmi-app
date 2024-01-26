/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 9:26:02 pm
 * Author: Nagendra S @ valmi.io
 */

import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { getIcon } from './SyncRunsUtils';

interface RunStatusIconProps {
  status: any;
  tooltipTitle: any;
  onClick: any;
}

const RunStatusIcon = ({
  status,
  tooltipTitle,
  onClick
}: RunStatusIconProps) => {
  return (
    <>
      <Tooltip title={tooltipTitle}>
        <IconButton
          color={
            status === 'failed' || status === 'terminated' ? 'error' : 'primary'
          }
          onClick={onClick}
        >
          {getIcon(status)}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default RunStatusIcon;
