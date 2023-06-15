/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import {
  ListItemButton,
  ListItemIcon,
  Typography,
  styled
} from '@mui/material';

const Icon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.colors.alpha.white[100]
}));

const Label = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70]
  //marginLeft: -20,
}));

const SidebarItem = ({ item, endpoint, onClick }: any) => {
  return (
    <ListItemButton
      onClick={() => onClick(item.path)}
      className={
        endpoint === `${item.sidebarProps.displayText.toLowerCase()}`
          ? 'active'
          : ''
      }
    >
      <Icon>{item.sidebarProps.icon && item.sidebarProps.icon}</Icon>
      <Label variant="h5">{item.sidebarProps.displayText}</Label>
    </ListItemButton>
  );
};

export default SidebarItem;
