/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 11:56:23 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import { useRouter } from 'next/router';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { capitalizeFirstLetter } from '@utils/lib';

const HeaderTitle = () => {
  const router = useRouter();
  const url = router.pathname;

  // query object
  const query = router.query;

  const valuesAfterWid = url.split('/').slice(3);

  const filterRoute = (route: any) => {
    const match = route.match(/\[(.*?)\]/);
    if (match && match.length > 1) {
      const valueInsideBrackets = match[1];
      return query[valueInsideBrackets];
    }
    return capitalizeFirstLetter(route);
  };

  /**
   * Navigates back in history.
   * Equivalent to clicking the browser back button.
   * Executes window.history.back()
   * @returns {Function}
   */
  const handleBack = () => {
    router.back();
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        aria-label="back"
        sx={{
          backgroundColor: (theme) => theme.colors.primary.main,
          color: 'white',
          mr: (theme) => theme.spacing(1)
        }}
        onClick={handleBack}
      >
        <ArrowBackIcon />
      </IconButton>
      <Breadcrumbs separator={'/'} aria-label="breadcrumb">
        {valuesAfterWid.length > 0 &&
          valuesAfterWid.map((route, index) => {
            return (
              <Typography key={`breadcrumb-${index}`} variant="body2">
                {filterRoute(route)}
              </Typography>
            );
          })}
      </Breadcrumbs>
    </Box>
  );
};

export default HeaderTitle;
