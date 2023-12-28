/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:30:34 pm
 * Author: Nagendra S @ valmi.io
 */

import { Typography, styled } from '@mui/material';

import SidebarItem, {
  TSidebarItemProps
} from '@layouts/SidebarLayout/Sidebar/SidebarItem';
import { memo } from 'react';

const Text = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[50],
  display: 'block',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
}));

const SidebarItemCollapse = ({
  item,
  onClick,
  currentRoute
}: TSidebarItemProps) => {
  return (
    item.sidebarProps && (
      <>
        <Text variant="body1">{item.sidebarProps.displayText}</Text>
        {item.child?.map(
          (route) =>
            route.sidebarProps &&
            (route.child ? (
              <SidebarItemCollapse
                currentRoute={currentRoute}
                onClick={onClick}
                item={route}
                key={route.id}
              />
            ) : (
              <SidebarItem
                currentRoute={currentRoute}
                onClick={onClick}
                item={route}
                key={route.id}
              />
            ))
        )}
      </>
    )
  );
};

export default memo(SidebarItemCollapse);
