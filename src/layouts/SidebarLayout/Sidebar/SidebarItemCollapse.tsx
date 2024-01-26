/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 8:30:34 pm
 * Author: Nagendra S @ valmi.io
 */
import { memo, useState } from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import SidebarItem, {
  TSidebarItemProps
} from '@layouts/SidebarLayout/Sidebar/SidebarItem';

const SidebarItemCollapse = ({
  item,
  onClick,
  currentRoute
}: TSidebarItemProps) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    item.sidebarProps && (
      <>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary={item.sidebarProps.displayText} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
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
          </List>
        </Collapse>
      </>
    )
  );
};

export default memo(SidebarItemCollapse);
