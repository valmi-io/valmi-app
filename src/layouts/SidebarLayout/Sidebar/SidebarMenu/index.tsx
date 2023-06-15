/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';
import { useRouter } from 'next/router';

import { Box, List, styled } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { SidebarContext } from 'src/contexts/SidebarContext';
import { RootState } from '../../../../store/reducers';
import { getSidebarRoutes } from '../../../../utils/sidebar-utils';
import SidebarItemCollapse from '../SidebarItemCollapse';
import SidebarItem from '../SidebarItem';
import { setAppState } from '../../../../store/reducers/appFlow';

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

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '', currentRoute } = appState;

  const handleListItemClick = (path: any) => {
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
  };

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List>
              {getSidebarRoutes(workspaceId).map(
                (route, index) =>
                  route.sidebarProps &&
                  (route.child ? (
                    <SidebarItemCollapse
                      item={route}
                      key={index}
                      endpoint={currentRoute}
                      onClick={handleListItemClick}
                    />
                  ) : (
                    <SidebarItem
                      item={route}
                      key={index}
                      endpoint={currentRoute}
                      onClick={handleListItemClick}
                    />
                  ))
              )}
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
};

export default SidebarMenu;
