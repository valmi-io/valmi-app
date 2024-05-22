/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, CircularProgress } from '@mui/material';

interface PageFooterProps {
  linkurl?: string;
  link?: boolean;
  footerButtonTitle?: string;
  displayFooterButton?: boolean;
  disabled?: boolean;
  isFetching?: boolean;
  displayStartIcon?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  customContent?: JSX.Element;
}

const PageFooter: FC<PageFooterProps> = ({
  link = false,
  footerButtonTitle = '',
  displayFooterButton = true,
  onClick,
  isFetching = false,
  displayStartIcon = true,
  disabled = false,
  customContent,
  ...rest
}) => {
  let endIcon = null;
  let startIcon = null;
  startIcon = displayStartIcon && <CloseIcon fontSize="small" />;
  endIcon = isFetching && <CircularProgress size={16} sx={{ color: (theme) => theme.colors.alpha.white[100] }} />;

  return (
    <Grid
      container
      sx={{
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
      {...rest}
    >
      {customContent
        ? customContent
        : displayFooterButton && (
            <Grid item>
              <Button
                endIcon={endIcon}
                startIcon={startIcon}
                disabled={disabled}
                sx={{ mt: { xs: 2, md: 0 }, fontSize: 14 }}
                variant="text"
                onClick={onClick}
              >
                {footerButtonTitle}
              </Button>
            </Grid>
          )}
    </Grid>
  );
};

export default PageFooter;
