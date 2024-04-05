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
    jitsuEnabled && {
      id: 0,
      path: `/spaces/${workspaceId}/onboarding`,
      sidebarProps: {
        displayText: 'ONBOARDING',
        icon: appIcons.TRACK
      }
    },
    {
      id: 1,
      path: `/spaces/${workspaceId}/events/connections`,
      sidebarProps: {
        displayText: 'CONNECTIONS',
        icon: appIcons.SYNC
      }
    },

    {
      id: 2,
      path: `/spaces/${workspaceId}/catalog`,
      sidebarProps: {
        displayText: 'CATALOG',
        icon: appIcons.CONNECTION
      }
    },
    jitsuEnabled && {
      id: 3,
      path: `/spaces/${workspaceId}/exploration`,
      sidebarProps: {
        displayText: 'EXPLORATION',
        icon: appIcons.STREAM
      },
      subRoutes: [4, 5]
    },
    {
      id: 4,
      path: `/spaces/${workspaceId}/exploration/query-editor`,
      sidebarProps: {
        displayText: 'QUERY EDITOR',
        icon: appIcons.SRC
      },
      subRoute: true
    },
    {
      id: 5,
      path: `/spaces/${workspaceId}/exploration/models`,
      sidebarProps: {
        displayText: 'MODELS',
        icon: appIcons.DEST
      },
      subRoute: true
    },

    {
      id: 6,
      path: `/spaces/${workspaceId}/oauth-apps`,
      sidebarProps: {
        displayText: 'CONFIGURE APPS',
        icon: appIcons.APPS,
        muiIcon: true
      }
    },
    {
      id: 7,
      path: `/spaces/${workspaceId}/shopify`,
      sidebarProps: {
        displayText: 'SHOPIFY',
        icon: appIcons.APPS,
        muiIcon: true
      }
    }
  ].filter(Boolean) as TSidebarRoute[];

  return routes;
};
