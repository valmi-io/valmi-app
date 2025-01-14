/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Typography } from '@mui/material';
import React, { CSSProperties } from 'react';

interface layoutProps {
  children: React.ReactNode;
  title?: string;
  layoutStyles?: CSSProperties;
}

const ConnectorLayout = ({ title = '', children, layoutStyles }: layoutProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      )}

      <Box sx={{ mt: 1 }} style={layoutStyles}>
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
};

export default ConnectorLayout;
