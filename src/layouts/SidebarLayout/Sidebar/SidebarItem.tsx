/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import { Button, Container, Icon, ListItemButton, Stack, Typography, styled, Box } from '@mui/material';
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
  const { id = '', path = '', sidebarProps: { icon = null, displayText = '', muiIcon = false } = {} } = item;

  return (
    <Box>
      <ListItemButton
        sx={{ my: 1, height: 50 }}
        onClick={() => onClick(path)}
        className={currentRoute === id ? 'active' : ''}
      >
        {icon && (muiIcon ? <Icon>{icon}</Icon> : <CustomIcon icon={icon} />)}
        <Typography>{displayText}</Typography>
      </ListItemButton>
    </Box>
  );
};

export default memo(SidebarItem);
