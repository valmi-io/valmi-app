/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import { Button, Icon, ListItemButton, Stack, Typography, styled } from '@mui/material';
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
    <ListItemButton
      sx={{ my: 1, height: 50 }}
      onClick={() => onClick(path)}
      className={currentRoute === id ? 'active' : ''}
    >
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={2}>
        {icon && (muiIcon ? <Icon>{icon}</Icon> : <CustomIcon icon={icon} />)}
        {displayText}
      </Stack>
    </ListItemButton>
  );
};

export default memo(SidebarItem);
