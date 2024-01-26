/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import { Icon, ListItemButton, Typography, styled, useTheme } from '@mui/material';
import CustomIcon from '@components/Icon/CustomIcon';
import { TSidebarRoute } from '@utils/sidebar-utils';

const Label = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70]
}));

export type TSidebarItemProps = {
  item: TSidebarRoute;
  currentRoute: any;
  onClick: (path: string) => void;
};

const SidebarItem = ({ item, currentRoute, onClick }: TSidebarItemProps) => {
  const theme = useTheme();

  const { id = '', path = '', sidebarProps: { icon = null, displayText = '', muiIcon = false } = {} } = item;

  return (
    <ListItemButton onClick={() => onClick(path)} className={currentRoute === id ? 'active' : ''}>
      {icon &&
        (muiIcon ? (
          <Icon style={{ marginRight: theme.spacing(3) }}>{icon}</Icon>
        ) : (
          <CustomIcon icon={icon} style={{ marginRight: theme.spacing(3) }} />
        ))}
      <Label variant="h5">{displayText}</Label>
    </ListItemButton>
  );
};

export default memo(SidebarItem);
