import { memo } from 'react';

import { ListItemButton, Typography, styled, useTheme } from '@mui/material';
import CustomIcon from '@components/Icon/CustomIcon';
import { TSidebarItemProps } from '@/layouts/SidebarLayout/Sidebar/SidebarItem';

const Label = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70]
}));

const SidebarNestedItem = ({ item, currentRoute, onClick }: TSidebarItemProps) => {
  const theme = useTheme();

  return (
    <ListItemButton
      sx={{ mx: 1 }}
      onClick={() => onClick(item.path)}
      className={currentRoute === item.id ? 'active' : ''}
    >
      {item.sidebarProps.icon && <CustomIcon icon={item.sidebarProps.icon} style={{ marginRight: theme.spacing(3) }} />}

      <Label variant="h6">{item.sidebarProps.displayText}</Label>
    </ListItemButton>
  );
};

export default memo(SidebarNestedItem);
