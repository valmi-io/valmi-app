/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:51:29 pm
 * Author: Nagendra S @ valmi.io
 */

import { Cable } from '@mui/icons-material';

import appIcons from '@utils/icon-utils';

type TSidebarPropsIn = {
  workspaceId: string | any;
  jitsuEnabled: boolean;
};

type TSidebarRouteProps = {
  displayText: string;
  icon: any;
};

export type TSidebarRoute = {
  id: number;
  path: string;
  sidebarProps: TSidebarRouteProps;
  child?: TSidebarRoute[];
};

export type TSidebarRoutePropsOut = TSidebarRoute[];

export const getSidebarRoutes = ({
  workspaceId,
  jitsuEnabled
}: TSidebarPropsIn): TSidebarRoutePropsOut => {
  const routes: TSidebarRoute[] = [
    jitsuEnabled && {
      id: 0,
      path: `/spaces/${workspaceId}/tracks`,
      sidebarProps: {
        displayText: 'TRACK',
        icon: appIcons.TRACK
      }
    },
    {
      id: 1,
      path: `/spaces/${workspaceId}/syncs`,
      sidebarProps: {
        displayText: 'ACTIVATE',
        icon: appIcons.SYNC
      }
    },
    {
      id: 2,
      path: '',
      sidebarProps: {
        displayText: 'SOURCES',
        icon: null
      },
      child: [
        jitsuEnabled && {
          id: 20,
          path: `/spaces/${workspaceId}/streams`,
          sidebarProps: {
            displayText: 'STREAMS',
            icon: appIcons.SRC
          }
        },
        {
          id: 21,
          path: `/spaces/${workspaceId}/connections/warehouses`,
          sidebarProps: {
            displayText: 'WAREHOUSES',
            icon: appIcons.SRC
          }
        }
      ]
    },
    {
      id: 3,
      path: '',
      sidebarProps: {
        displayText: 'DESTINATIONS',
        icon: null
      },
      child: [
        {
          id: 30,
          path: `/spaces/${workspaceId}/cloud-warehouses`,
          sidebarProps: {
            displayText: 'SaaS TOOLS',
            icon: appIcons.SRC
          }
        },
        jitsuEnabled && {
          id: 31,
          path: `/spaces/${workspaceId}/connections/destinations`,
          sidebarProps: {
            displayText: 'WAREHOUSES',
            icon: appIcons.DEST
          }
        }
      ]
    }
  ].filter(Boolean) as TSidebarRoute[];

  return routes;
};
