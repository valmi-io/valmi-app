/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Typography, Button, Grid, CircularProgress } from '@mui/material';
import Link from 'next/link';
import VButton from '@/components/VButton';

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
  customContent?: JSX.Element;
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
  customContent,
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
        <Typography variant="h6" component="h6" sx={{ mr: link ? 2 : 0 }}>
          {title}
        </Typography>
      </Grid>
      {customContent
        ? customContent
        : displayButton && (
            <Grid item>
              {link ? (
                <Link href={linkurl} target="_blank" passHref style={{ textDecoration: 'none' }}>
                  <VButton
                    buttonText={buttonTitle}
                    buttonType="submit"
                    endIcon={endIcon}
                    startIcon={startIcon}
                    size="small"
                    disabled={disabled}
                    variant="contained"
                  />
                </Link>
              ) : (
                <VButton
                  buttonText={buttonTitle}
                  buttonType="submit"
                  endIcon={endIcon}
                  startIcon={startIcon}
                  onClick={onClick}
                  size="small"
                  disabled={disabled}
                  variant="contained"
                />
              )}
            </Grid>
          )}
    </Grid>
  );
};

export default PageTitle;
