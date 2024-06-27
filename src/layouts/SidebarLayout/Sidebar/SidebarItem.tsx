/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from 'react';

import { Icon, ListItemButton, Typography, styled, Box, ListItemText, SxProps } from '@mui/material';
import CustomIcon from '@components/Icon/CustomIcon';
import { TSidebarRoute } from '@utils/sidebar-utils';
import { Theme } from '@mui/material/styles';

const ItemContainer = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  width: theme.sidebar.width,
  height: 48,
  flexGrow: 0
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  minWidth: 56,
  backgroundColor: 'transparent'
}));

const InnerIconBox = styled(Icon)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  backgroundColor: 'transparent'
}));

const TextBox = styled(ListItemText)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '4px 0px'
}));

export type TSidebarItemProps = {
  item: TSidebarRoute;
  currentRoute: any;
  onClick: (path: string) => void;
  styles?: SxProps<Theme> | undefined;
};

const SidebarItem = ({ item, currentRoute, onClick, styles }: TSidebarItemProps) => {
  const { id = '', path = '', sidebarProps: { icon = null, displayText = '', muiIcon = false } = {} } = item;

  return (
    <ItemContainer sx={styles} onClick={() => onClick(path)} className={currentRoute === id ? 'active' : ''}>
      <IconContainer>
        <InnerIconBox>
          {icon && (muiIcon ? <Icon sx={{ display: 'flex' }}>{icon}</Icon> : <CustomIcon icon={icon} />)}
        </InnerIconBox>
      </IconContainer>

      <TextBox>
        <Typography variant="button">{displayText}</Typography>
      </TextBox>
    </ItemContainer>
  );
};

export default memo(SidebarItem);
