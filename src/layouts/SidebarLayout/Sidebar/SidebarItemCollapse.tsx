/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:30:34 pm
 * Author: Nagendra S @ valmi.io
 */

import { Typography, styled } from '@mui/material';

import SidebarItem from '@layouts/SidebarLayout/Sidebar/SidebarItem';

const Text = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[50],
  display: 'block',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
}));

const SidebarItemCollapse = ({ item, onClick, endpoint }: any) => {
  return item.sidebarProps ? (
    <>
      <Text variant="h6">{item.sidebarProps.displayText}</Text>
      {item.child?.map((route: any, index: any) =>
        route.sidebarProps ? (
          route.child ? (
            <SidebarItemCollapse
              item={route}
              key={index}
              endpoint={endpoint}
              onClick={onClick}
            />
          ) : (
            <SidebarItem
              item={route}
              key={index}
              endpoint={endpoint}
              onClick={onClick}
            />
          )
        ) : null
      )}
    </>
  ) : null;
};

export default SidebarItemCollapse;
