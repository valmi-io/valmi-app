/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import { ListItemButton, Typography, styled, useTheme } from '@mui/material';
import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';
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

  return (
    <ListItemButton onClick={() => onClick(item.path)} className={currentRoute === item.id ? 'active' : ''}>
      {item.sidebarProps.icon && <FontAwesomeIcon icon={item.sidebarProps.icon} style={{ marginRight: theme.spacing(3) }} />}

      <Label variant="h5">{item.sidebarProps.displayText}</Label>
    </ListItemButton>
  );
};

export default memo(SidebarItem);
