/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 11:56:23 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import { useRouter } from 'next/router';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Typography, Icon, styled, Button, Link } from '@mui/material';
import { capitalizeFirstLetter } from '@utils/lib';
import { blackColor } from '@theme/schemes/AppFlowyTheme';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

const BackIcon = styled(Icon)(({ theme }) => ({
  display: 'flex',
  color: blackColor,
  alignItems: 'center'
}));

const HeaderTitle = () => {
  const router = useRouter();
  const url = router.pathname;

  // query object
  const query = router.query;

  const createQueryString = (queryParams: any) => {
    let queryStringArray = [];

    for (let key in queryParams) {
      if (queryParams.hasOwnProperty(key) && key !== 'wid') {
        queryStringArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`);
      }
    }

    return queryStringArray.join('&');
  };

  let valuesAfterWid = url.split('/').slice(3);
  const getQueryValue = (route: string, index: number) => {
    let values = valuesAfterWid.map((item) => {
      if (item.startsWith('[') && item.endsWith(']')) {
        let path: any = item.split('');
        path.shift();
        path.pop();
        path = path.join('');
        if (query[path]) return query[path];
      } else return item;
    });
    if (!!query && index === valuesAfterWid.length - 1) {
      return `${values.join('/')}?${createQueryString(query)}`;
    } else if (values.indexOf(route) !== 0) {
      return values.join('/');
    } else return route;
  };

  const getIconName = (name: string) => {
    const routeName = name.replace(/-/g, '').toUpperCase();

    switch (routeName) {
      case 'CONNECTIONS':
        return appIcons.DATA_FLOWS;
      case 'OAUTHAPPS':
        return appIcons.APPS;
      case 'PROMPTS':
        return appIcons.EXPLORES;
      default:
        //@ts-ignore
        return appIcons[routeName] || null;
    }
  };

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

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <BackIcon>
        <CustomIcon icon={getIconName(valuesAfterWid[0])} />
      </BackIcon>
      <Box>
        <Breadcrumbs separator={'>'} aria-label="breadcrumb">
          {valuesAfterWid.length > 0 &&
            valuesAfterWid.map((route, index) => {
              return (
                <Link
                  key={`breadcrumb-${index}`}
                  sx={{
                    padding: 0,
                    textDecoration: 'none'
                  }}
                  href={
                    valuesAfterWid.length > 1
                      ? `/spaces/${query?.wid}/${getQueryValue(route, index)}`
                      : `/spaces/${query?.wid}/${route}`
                  }
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        index !== valuesAfterWid.length - 1
                          ? (theme) => theme.colors.alpha.black[50]
                          : (theme) => theme.colors.alpha.black[100]
                    }}
                  >
                    {filterRoute(route)}
                  </Typography>
                </Link>
              );
            })}
        </Breadcrumbs>
      </Box>
    </Box>
  );
};

export default HeaderTitle;
