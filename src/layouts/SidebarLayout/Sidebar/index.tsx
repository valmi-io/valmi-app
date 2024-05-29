/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';

import { Box, Drawer, styled, Divider, useTheme, Paper, Stack } from '@mui/material';

import SidebarMenu from '@layouts/SidebarLayout/Sidebar/SidebarMenu';

import { SidebarContext } from '@contexts/SidebarContext';

import Logo, { SidebarLogo } from '@components/LogoSign';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const SidebarPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: theme.sidebar.width,
  height: '100%',
  backgroundColor: theme.sidebar.background
}));

const ImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: theme.sidebar.width,
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  backgroundColor: theme.sidebar.background
}));

const SidebarDivider = styled(Divider)(({ theme }) => ({
  width: theme.sidebar.width,
  border: '1px solid rgba(97, 97, 97, 0.9)',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
}));

const SidebarPaperComponent = (workspaceId: any, sidebarToggle: boolean) => {
  let displayProps: any = {
    lg: 'inline-block'
  };
  if (!sidebarToggle) {
    displayProps = {
      xs: 'none',
      lg: 'inline-block'
    };
  }
  return (
    <SidebarPaper
      sx={{
        position: 'fixed',
        display: displayProps
      }}
    >
      <ImageBox>
        <SidebarLogo />
      </ImageBox>
      <SidebarDivider />
      <SidebarMenu key={'SidebarDrawer'} workspaceId={workspaceId} />
    </SidebarPaper>
  );
};

const Sidebar = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { workspaceId = null } = useWorkspaceId();

  const theme = useTheme();

  return (
    <>
      {SidebarPaperComponent(workspaceId, false)}
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`
        }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={toggleSidebar}
        variant="temporary"
        elevation={9}
      >
        {SidebarPaperComponent(workspaceId, true)}
      </Drawer>
    </>
  );
};

export default Sidebar;
