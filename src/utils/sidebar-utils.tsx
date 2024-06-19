/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:51:29 pm
 * Author: Nagendra S @ valmi.io
 */

import appIcons from '@utils/icon-utils';

type TSidebarPropsIn = {
  workspaceId: string | any;
  jitsuEnabled: boolean;
};

type TSidebarRouteProps = {
  displayText: string;
  icon: any;
  muiIcon?: boolean;
};

export type TSidebarRoute = {
  id: number;
  path: string;
  sidebarProps: TSidebarRouteProps;
  child?: TSidebarRoute[];
  subRoutes?: string[];
  subRoute?: boolean;
};

export type TSidebarRoutePropsOut = TSidebarRoute[];

export const getSidebarRoutes = ({ workspaceId, jitsuEnabled }: TSidebarPropsIn): TSidebarRoutePropsOut => {
  const routes: TSidebarRoute[] = [
    {
      id: 0,
      path: `/spaces/${workspaceId}/explores`,
      sidebarProps: {
        displayText: 'EXPLORES',
        icon: appIcons.EXPLORES,
        muiIcon: false
      }
    },
    {
      id: 1,
      path: `/spaces/${workspaceId}/data-flows`,
      sidebarProps: {
        displayText: 'DATA FLOWS',
        icon: appIcons.DATA_FLOWS,
        muiIcon: false
      }
    },

    {
      id: 2,
      path: `/spaces/${workspaceId}/catalog`,
      sidebarProps: {
        displayText: 'CATALOG',
        icon: appIcons.CATALOG,
        muiIcon: false
      }
    },

    {
      id: 3,
      path: `/spaces/${workspaceId}/oauth-apps`,
      sidebarProps: {
        displayText: 'CONFIGURE APPS',
        icon: appIcons.APPS,
        muiIcon: false
      }
    }
  ].filter(Boolean) as TSidebarRoute[];

  return routes;
};
