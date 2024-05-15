/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, October 18th 2023, 6:42:29 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Grid, Typography } from '@mui/material';

interface AuthenticationFormFooterProps {
  footerText: string;
}

const AuthenticationFormFooter: React.FC<AuthenticationFormFooterProps> = ({ footerText }) => {
  return (
    <Grid container justifyContent={'flex-end'}>
      <Grid item>
        <Typography
          sx={{
            color: (theme) => theme.palette.secondary.main
          }}
          variant="body2"
        >
          {footerText}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthenticationFormFooter;
