import React from 'react';

import Link from 'next/link';

import { Grid, Typography } from '@mui/material';

interface AuthenticationFormFooterProps {
  footerText: string;
  href: any;
}

const AuthenticationFormFooter: React.FC<AuthenticationFormFooterProps> = ({
  footerText,
  href
}) => {
  return (
    <Grid container justifyContent="flex-end">
      <Grid item>
        <Link href={href} style={{ textDecoration: 'none' }}>
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
