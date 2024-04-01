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
      path: `/spaces/${workspaceId}/events`,
      sidebarProps: {
        displayText: 'EVENTS',
        icon: appIcons.TRACK
      },
      subRoutes: [2, 3, 4]
    },
    {
      id: 1,
      path: `/spaces/${workspaceId}/syncs`,
      sidebarProps: {
        displayText: 'ACTIVATE',
        icon: appIcons.SYNC
      },
      subRoutes: [5, 6]
    },

    {
      id: 2,
      path: `/spaces/${workspaceId}/events/connections`,
      sidebarProps: {
        displayText: 'CONNECTIONS',
        icon: appIcons.CONNECTION
      },
      subRoute: true
    },
    jitsuEnabled && {
      id: 3,
      path: `/spaces/${workspaceId}/streams`,
      sidebarProps: {
        displayText: 'STREAMS',
        icon: appIcons.STREAM
      },
      subRoute: true
    },
    jitsuEnabled && {
      id: 4,
      path: `/spaces/${workspaceId}/destination-warehouses`,
      sidebarProps: {
        displayText: 'WAREHOUSES',
        icon: appIcons.SRC
      },
      subRoute: true
    },
    {
      id: 5,
      path: `/spaces/${workspaceId}/connections/warehouses`,
      sidebarProps: {
        displayText: 'WAREHOUSES',
        icon: appIcons.SRC
      },
      subRoute: true
    },
    {
      // valmi
      id: 6,
      path: `/spaces/${workspaceId}/connections/destinations`,
      sidebarProps: {
        displayText: 'DESTINATIONS',
        icon: appIcons.DEST
      },
      subRoute: true
    },


    {
      id: 7,
      path: `/spaces/${workspaceId}/etl`,
      sidebarProps: {
        displayText: 'ETL',
        icon: appIcons.ETL_ICON
      },
      subRoutes: [8, 9]
    },
    {
      id : 8,
      path: `/spaces/${workspaceId}/etl/source`,
      sidebarProps:{
        displayText: 'SOURCE',
        icon: appIcons.SOURCE_ICON
      },
      subRoute : true
    },
    {
      id: 9,
      path: `/spaces/${workspaceId}/etl/destination`,
      sidebarProps : {
        displayText: 'DESTINATION',
        icon: appIcons.DESTINATION_ICON
      },
      subRoute: true
    },
    {
      id: 10,
      path: `/spaces/${workspaceId}/oauth-apps`,
      sidebarProps: {
        displayText: 'CONFIGURE APPS',
        icon: appIcons.APPS,
        muiIcon: true
      }
    }
    ,


  ].filter(Boolean) as TSidebarRoute[];

  return routes;
};