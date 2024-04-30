/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';

import { Box, Drawer, styled, Divider, useTheme } from '@mui/material';

import SidebarMenu from '@layouts/SidebarLayout/Sidebar/SidebarMenu';

import { SidebarContext } from '@contexts/SidebarContext';

import Logo from '@components/LogoSign';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

const Sidebar = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { workspaceId = null } = useWorkspaceId();

  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          background: theme.palette.mode === 'dark' ? theme.colors.alpha.white[100] : theme.colors.alpha.black[100],
          boxShadow: theme.palette.mode === 'dark' ? theme.sidebar.boxShadow : 'none'
        }}
      >
        <Box mt={2}>
          <Box
            sx={{
              width: '100%'
            }}
          >
            <Logo />
          </Box>
        </Box>
        <Divider
          sx={{
            mt: theme.spacing(2),
            mx: theme.spacing(2),
            background: theme.colors.alpha.trueWhite[10]
          }}
        />
        <SidebarMenu key={'SidebarMenu'} workspaceId={workspaceId} />
      </SidebarWrapper>
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
        <SidebarWrapper
          sx={{
            background: theme.palette.mode === 'dark' ? theme.colors.alpha.white[100] : theme.colors.alpha.black[100]
          }}
        >
          <Box mt={3}>
            <Box
              mx={2}
              sx={{
                width: 52
              }}
            >
              <Logo />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10]
            }}
          />
          <SidebarMenu key={'SidebarDrawer'} workspaceId={workspaceId} />
        </SidebarWrapper>
      </Drawer>
    </>
  );
};

export default Sidebar;
