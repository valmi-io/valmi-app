/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { Stack } from '@mui/material';

import SidebarItem from '@layouts/SidebarLayout/Sidebar/SidebarItem';

import { SidebarContext } from '@contexts/SidebarContext';

import { TSidebarRoute, getSidebarRoutes } from '@utils/sidebar-utils';
import { isJitsuEnabled } from '@utils/routes';
import { getBrowserRoute, getRoute } from '@/utils/lib';

type TSidebarMenuProps = {
  workspaceId: any;
};

const SidebarMenu = ({ workspaceId }: TSidebarMenuProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { closeSidebar } = useContext(SidebarContext);

  const [selectedRoute, setSelectedRoute] = useState('');

  useEffect(() => {
    if (router.pathname) {
      const { route: browserRoute, subRoute: browserSubRoute } = getBrowserRoute(router.pathname as string);
      setSelectedRoute(browserRoute);
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

    if (pathToCheck === 'prompts') {
      const result: any = findPathInRoutes(routes, 'explores');

      return { found: true, id: result.id };
    } else {
      return { found: false }; // Path not found in this branch
    }
  };

  const activeIndex = useMemo(() => {
    const route = selectedRoute;

    const { id = 0 } = findPathInRoutes(sidebarRoutes, route);

    return id;
  }, [selectedRoute, sidebarRoutes]);

  const handleItemOnClick = useCallback(
    (path: string) => {
      // extracting current route from path
      const route = getRoute(path);

      setSelectedRoute(route);

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
        <SidebarItem key={route.id} item={route} currentRoute={activeIndex} onClick={handleItemOnClick} />
      </React.Fragment>
    );
  });

  return <Stack>{sidebarItems}</Stack>;
};

export default memo(SidebarMenu);
