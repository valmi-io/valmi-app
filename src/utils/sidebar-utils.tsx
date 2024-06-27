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
      path: `/spaces/${workspaceId}/events`,
      sidebarProps: {
        displayText: 'EVENTS',
        icon: appIcons.TRACK,
        muiIcon: false
      },
      subRoutes: [1, 2, 3]
    },
    {
      id: 1,
      path: `/spaces/${workspaceId}/events/streams`,
      sidebarProps: {
        displayText: 'STREAMS',
        icon: appIcons.STREAM,
        muiIcon: false
      },
      subRoute: true
    },
    {
      id: 2,
      path: `/spaces/${workspaceId}/events/destination-warehouses`,
      sidebarProps: {
        displayText: 'WAREHOUSES',
        icon: appIcons.SRC,
        muiIcon: false
      },
      subRoute: true
    },
    {
      id: 3,
      path: `/spaces/${workspaceId}/events/connections`,
      sidebarProps: {
        displayText: 'CONNECTIONS',
        icon: appIcons.CONNECTION,
        muiIcon: false
      },
      subRoute: true
    },
    {
      id: 4,
      path: `/spaces/${workspaceId}/explores`,
      sidebarProps: {
        displayText: 'EXPLORES',
        icon: appIcons.EXPLORES,
        muiIcon: false
      }
    },
    {
      id: 5,
      path: `/spaces/${workspaceId}/data-flows`,
      sidebarProps: {
        displayText: 'DATA FLOWS',
        icon: appIcons.DATA_FLOWS,
        muiIcon: false
      }
    },

    {
      id: 6,
      path: `/spaces/${workspaceId}/catalog`,
      sidebarProps: {
        displayText: 'CATALOG',
        icon: appIcons.CATALOG,
        muiIcon: false
      }
    },

    {
      id: 7,
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
