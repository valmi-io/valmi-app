/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:51:29 pm
 * Author: Nagendra S @ valmi.io
 */

import { Cable } from '@mui/icons-material';

import appIcons from '@utils/icon-utils';

export const getSidebarRoutes = (workspaceId: any) => {
  return [
    {
      path: `/spaces/${workspaceId}/syncs`,
      sidebarProps: {
        displayText: 'Syncs',
        icon: appIcons.SYNC
      }
    },
    {
      path: `/spaces/${workspaceId}/connections`,
      sidebarProps: {
        displayText: 'Connections',
        icon: <Cable />
      },
      child: [
        {
          path: `/spaces/${workspaceId}/connections/warehouses`,
          sidebarProps: {
            displayText: 'Warehouses',
            icon: appIcons.SRC
          }
        },
        {
          path: `/spaces/${workspaceId}/connections/destinations`,
          sidebarProps: {
            displayText: 'Destinations',
            icon: appIcons.DEST
          }
        }
      ]
    }
  ];
};
