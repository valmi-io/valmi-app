/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, October 18th 2023, 6:42:29 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import Link from 'next/link';

import { Grid, Typography } from '@mui/material';

interface AuthenticationFormFooterProps {
  footerText: string;
  href: any;
  isLoginPage?: boolean;
}

const AuthenticationFormFooter: React.FC<AuthenticationFormFooterProps> = ({
  footerText,
  href,
  isLoginPage = false
}) => {
  return (
    <Grid container justifyContent={isLoginPage ? 'space-between' : 'flex-end'}>
      {isLoginPage && (
        <Grid item>
          <Link aria-label={footerText} href={'/reset_password'} style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: (theme) => theme.palette.primary.main
              }}
              variant="body2"
            >
              {'Forgot Password?'}
            </Typography>
          </Link>
        </Grid>
      )}
      <Grid item>
        <Link aria-label={footerText} href={href} style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main
            }}
            variant="body2"
          >
            {footerText}
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

export default AuthenticationFormFooter;
