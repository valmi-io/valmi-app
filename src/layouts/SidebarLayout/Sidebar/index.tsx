/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';

import { Box, Drawer, styled, Divider, useTheme, Paper, Stack } from '@mui/material';

import SidebarMenu from '@layouts/SidebarLayout/Sidebar/V2SidebarMenu';

import { SidebarContext } from '@contexts/SidebarContext';

import Logo, { SidebarLogo } from '@components/LogoSign';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const SidebarPaper = styled(Paper)(
  ({ theme }) => `
    padding: 0px;
    width: ${theme.sidebar.width};
    height: 100%;
    background-color: ${theme.sidebar.background};
  `
);

const ImageBox = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: ${theme.spacing(2)};
    width: 248px;
    height: 64px;
  `
);

const SidebarDivider = styled(Divider)(
  ({ theme }) => `
    width: 248px;
    border: 1px solid rgba(97, 97, 97, 0.9);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    transform: matrix(nan, nan, 0, 1, 0, 0);
  `
);

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
      <SidebarDivider sx={{ borderColor: 'white' }} />
      <SidebarMenu key={'SidebarDrawer'} workspaceId={workspaceId} />
    </SidebarPaper>
  );
};

const Sidebar = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { workspaceId = null } = useWorkspaceId();

  const theme = useTheme();

  console.log(sidebarToggle);

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
