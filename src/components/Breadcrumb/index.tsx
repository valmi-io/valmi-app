/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 11:56:23 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import { useRouter } from 'next/router';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Typography, Icon, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { capitalizeFirstLetter } from '@utils/lib';
import { blackColor } from '@theme/schemes/AppFlowyTheme';

const BackIcon = styled(Icon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: blackColor,
  cursor: 'pointer'
}));

const HeaderTitle = () => {
  const router = useRouter();
  const url = router.pathname;

  // query object
  const query = router.query;

  const valuesAfterWid = url.split('/').slice(3);

  /**
   *
   * @param route
   * @returns {Function}
   */

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
      <BackIcon onClick={handleBack}>
        <ArrowBackIcon />
      </BackIcon>
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
