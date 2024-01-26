/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';

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
import { AppState } from '@/store/store';
import { getBrowserRoute, getRoute } from '@/utils/lib';
import SidebarNestedItem from '@/layouts/SidebarLayout/Sidebar/SidebarNestedItem';

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

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { currentRoute = '' } = appState;

  useEffect(() => {
    const { route: browserRoute, subRoute: browserSubRoute } = getBrowserRoute(router.pathname as string);

    const connectionRoutes = ['warehouses', 'destinations'];

    const subRoutes = ['create', 'callback', '[sid]', 'warehouses', 'destinations', 'connections', 'live-events'];

    if (!browserSubRoute && browserRoute !== currentRoute && browserRoute !== 'connections') {
      // Handle non-sub-route case
      handleRouteChange(browserRoute);
    } else if (browserSubRoute && subRoutes.includes(browserSubRoute)) {
      // Handle sub-routes

      if (browserRoute !== currentRoute) {
        if (browserRoute !== 'connections') {
          if (browserRoute === 'events' && browserSubRoute === 'connections') {
            handleRouteChange(browserSubRoute);
          } else {
            // Handle non-connections route
            handleRouteChange(browserRoute);
          }
        } else if (connectionRoutes.includes(browserSubRoute) && browserSubRoute !== currentRoute) {
          // Handle connections route with valid sub-route
          handleRouteChange(browserSubRoute);
        } else if (!connectionRoutes.includes(currentRoute)) {
          // Handle create | callback route
          handleRouteChange(connectionRoutes[0]);
        }
      } else if (browserRoute === 'events' && browserSubRoute === 'connections') {
        handleRouteChange(browserSubRoute);
      }
    }
  }, [router.pathname]);

  const sidebarRoutes = useMemo(() => {
    return getSidebarRoutes({ workspaceId, jitsuEnabled: isJitsuEnabled() });
  }, [workspaceId, isJitsuEnabled()]);

  const findPathInRoutes = (routes: TSidebarRoute[], pathToCheck: string) => {
    for (const route of routes) {
      let currentPath: string = route.path?.split('/').slice(-1)[0].toLowerCase();

      if (currentPath.toLowerCase() === pathToCheck) {
        return { found: true, id: route.id }; // Found the path in top-level routes
      }
      if (route.child) {
        const foundInChildren: any = findPathInRoutes(route.child, pathToCheck);

        if (foundInChildren.found) {
          return foundInChildren; // Found the path in children
        }
      }
    }
    return { found: false }; // Path not found in this branch
  };

  const handleRouteChange = (route: string) => {
    dispatch(
      setAppState({
        ...appState,
        currentRoute: route
      })
    );
  };

  const activeIndex = useMemo(() => {
    let currentStorePath = currentRoute;

    const { found, id = 0 } = findPathInRoutes(sidebarRoutes, currentStorePath);

    return id;
  }, [currentRoute, sidebarRoutes]);

  const handleItemOnClick = useCallback(
    (path: string) => {
      // extracting current route from path
      const currentRoute = getRoute(path);

      handleRouteChange(currentRoute);

      // Navigate to route based on the name of the list item
      router.push(path);
      // Close the sidebar
      closeSidebar();
    },
    [dispatch]
  );

  const sidebarItems = sidebarRoutes.map((route) => {
    if (!route) return null;

    return (
      <React.Fragment key={route.id}>
        {route.sidebarProps ? (
          <>
            {route.child ? (
              <SidebarItemCollapse key={route.id} item={route} currentRoute={activeIndex} onClick={handleItemOnClick} />
            ) : (
              <>
                {route.subRoutes ? (
                  <>
                    <SidebarItem key={route.id} item={route} currentRoute={activeIndex} onClick={handleItemOnClick} />
                    {route.subRoutes.map((routeId) => {
                      const nestedRoute: any = sidebarRoutes.find((route) => Number(route.id) === Number(routeId));

                      return (
                        <SidebarNestedItem
                          key={nestedRoute.id}
                          item={nestedRoute}
                          currentRoute={activeIndex}
                          onClick={handleItemOnClick}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    {!route.subRoute && (
                      <SidebarItem key={route.id} item={route} currentRoute={activeIndex} onClick={handleItemOnClick} />
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : null}
      </React.Fragment>
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
