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

const MenuContainer = styled(Container)(
  ({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 16px;
    width: 248px;
    height: 48px;

`
);

const IconBox = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  width: 56px;
  min-width: 56px;
  height: 24px;

  `
);

const InnerIconBox = styled(Box)(
  ({ theme }) => `
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;

    width: 24px;
    height: 24px;
`
);

const TextBox = styled(Box)(
  ({ theme }) => `

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 4px 0px;
    width: 160px;
    height: 32px;

  `
);

export type TSidebarItemProps = {
  item: TSidebarRoute;
  currentRoute: any;
  onClick: (path: string) => void;
};

const SidebarItem = ({ item, currentRoute, onClick }: TSidebarItemProps) => {
  const { id = '', path = '', sidebarProps: { icon = null, displayText = '', muiIcon = false } = {} } = item;

  return (
    <MenuContainer>
      <ListItemButton
        sx={{ my: 1, height: 50, p: 0 }}
        onClick={() => onClick(path)}
        className={currentRoute === id ? 'active' : ''}
      >
        <IconBox>
          <InnerIconBox> {icon && (muiIcon ? <Icon>{icon}</Icon> : <CustomIcon icon={icon} />)}</InnerIconBox>
        </IconBox>
        <Typography>{displayText}</Typography>
      </ListItemButton>
    </MenuContainer>
  );
};

export default memo(SidebarItem);
