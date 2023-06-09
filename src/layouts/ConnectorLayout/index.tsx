/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, CardHeader } from '@mui/material';
import React from 'react';

interface layoutProps {
  children: React.ReactNode;
  title: string;
}

const ConnectorLayout = ({ title, children }: layoutProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <CardHeader title={title} />
      {/* <Divider /> */}
      <Box sx={{ m: 1 }}>
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
};

export default ConnectorLayout;
