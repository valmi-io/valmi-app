/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 11:56:23 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import { useRouter } from 'next/router';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Typography } from '@mui/material';

import { capitalizeFirstLetter } from '@utils/lib';

export default function IconBreadcrumbs() {
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

  return (
    <Box>
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
}
