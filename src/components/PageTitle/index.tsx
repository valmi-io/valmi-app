/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Typography, Button, Grid, CircularProgress } from '@mui/material';
import Link from 'next/link';

interface PageTitleProps {
  title: string;
  linkurl?: string;
  link?: boolean;
  buttonTitle?: string;
  displayButton?: boolean;
  disabled?: boolean;
  isFetching?: boolean;
  displayStartIcon?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PageTitle: FC<PageTitleProps> = ({
  title = '',
  linkurl = '/',
  link = false,
  buttonTitle = '',
  displayButton = true,
  onClick,
  isFetching = false,
  displayStartIcon = true,
  disabled = false,
  ...rest
}) => {
  let endIcon = null;
  let startIcon = null;
  startIcon = displayStartIcon && <AddTwoToneIcon fontSize="small" />;
  endIcon = isFetching && <CircularProgress size={16} sx={{ color: (theme) => theme.colors.alpha.white[100] }} />;

  return (
    <Grid
      container
      sx={{
        justifyContent: link ? 'flex-start' : 'space-between',
        alignItems: 'center'
      }}
      {...rest}
    >
      <Grid item>
        <Typography variant="h4" component="h4" sx={{ mr: link ? 2 : 0 }}>
          {title}
        </Typography>
      </Grid>
      {displayButton && (
        <Grid item>
          {link ? (
            <Link href={linkurl} target="_blank" passHref style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: 'black'
                }}
                variant="contained"
                color="warning"
              >
                {buttonTitle.toUpperCase()}
              </Button>
            </Link>
          ) : (
            <Button
              endIcon={endIcon}
              startIcon={startIcon}
              disabled={disabled}
              sx={{ mt: { xs: 2, md: 0 }, fontWeight: 'bold', fontSize: 14 }}
              variant="contained"
              onClick={onClick}
            >
              {buttonTitle.toUpperCase()}
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default PageTitle;
