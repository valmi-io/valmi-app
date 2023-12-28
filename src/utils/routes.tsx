/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 10:43:34 pm
 * Author: Nagendra S @ valmi.io
 */

export const publicRoutes = [
  '/login',
  '/signup',
  '/activate',
  '/activate/[uid]/[tid]'
];

export const isPublicSync = (pathname: string): boolean => {
  const publicSyncRun = `/spaces/${process.env.PUBLIC_WORKSPACE}/syncs/${process.env.PUBLIC_SYNC}/runs`;
  if (pathname === publicSyncRun) return true;
  return false;
};

export const isJitsuEnabled = () => {
  return process.env.ENABLE_JITSU === 'True' ? true : false;
};

export const filterRoute = (routerQueryObj: any, route: any) => {
  const match = route.match(/\[(.*?)\]/);
  if (match && match.length > 1) {
    const valueInsideBrackets = match[1];
    return routerQueryObj[valueInsideBrackets]; // query - router.query
  }
  return route;
};

export const getRouterPathname = (
  routerQueryObj: any,
  pathname: string
): string => {
  const valuesAfterWid = pathname.split('/').slice(1);
  let modifiedPathname = '';

  if (valuesAfterWid.length > 0) {
    for (let i = 0; i < valuesAfterWid.length; i++) {
      modifiedPathname = modifiedPathname.concat(
        `/${filterRoute(routerQueryObj, valuesAfterWid[i])}`
      );
    }
  } else {
    modifiedPathname = pathname;
  }
  return modifiedPathname;
};
