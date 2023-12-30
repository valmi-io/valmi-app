/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { Box, List, styled } from '@mui/material';

import SidebarItemCollapse from '@layouts/SidebarLayout/Sidebar/SidebarItemCollapse';
import SidebarItem from '@layouts/SidebarLayout/Sidebar/SidebarItem';

import { SidebarContext } from '@contexts/SidebarContext';

import { RootState } from '@store/reducers';
import { setAppState } from '@store/reducers/appFlow';

import { TSidebarRoute, getSidebarRoutes } from '@utils/sidebar-utils';
import { isJitsuEnabled } from '@utils/routes';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(0.5)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(0)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      color: ${theme.colors.alpha.black[70]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 0px 0;

        .MuiListItemButton-root {

          &.active {
            color: ${theme.colors.alpha.white[100]};
            font-weight:500;
          }
        }
      }
    }
`
);

type TSidebarMenuProps = {
  workspaceId: any;
};

const SidebarMenu = ({ workspaceId }: TSidebarMenuProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { closeSidebar } = useContext(SidebarContext);

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { currentRoute = '' } = appState;

  const sidebarRoutes = useMemo(() => {
    return getSidebarRoutes({ workspaceId, jitsuEnabled: isJitsuEnabled() });
  }, [workspaceId, isJitsuEnabled()]);

  const getActiveIndex = (routes: TSidebarRoute[]): number => {
    let activeIndex = -1;
    for (let i = 0; i < routes.length; i++) {
      let item = routes[i];
      let currentPath = item.path?.split('/').slice(-1)[0].toLowerCase();

      if (currentRoute.toLowerCase() === currentPath) {
        activeIndex = item.id;
        break;
      } else if (item.child) {
        activeIndex = getActiveIndex(item.child);
        if (activeIndex !== -1) {
          break;
        }
      }
    }

    return activeIndex;
  };

  const handleItemOnClick = useCallback(
    (path: string) => {
      // extracting current route from path
      const currentRoute = path?.split('/').slice(-1)[0];
      // update current route in redux store.
      dispatch(
        setAppState({
          ...appState,
          currentRoute: currentRoute
        })
      );
      // Navigate to route based on the name of the list item
      router.push(path);
      // Close the sidebar
      closeSidebar();
    },
    [dispatch]
  );

  const sidebarItems = sidebarRoutes.map((route) => {
    if (!route) return null;
    return route.sidebarProps && route.child ? (
      <SidebarItemCollapse key={route.id} item={route} currentRoute={getActiveIndex(sidebarRoutes)} onClick={handleItemOnClick} />
    ) : (
      <SidebarItem key={route.id} item={route} currentRoute={getActiveIndex(sidebarRoutes)} onClick={handleItemOnClick} />
    );
  });

  return (
    <>
      <MenuWrapper>
        <SubMenuWrapper>
          <List>{sidebarItems}</List>
        </SubMenuWrapper>
      </MenuWrapper>
    </>
  );
};

export default memo(SidebarMenu);
