/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';

import { Box, Drawer, styled, Divider, useTheme, Paper, Stack } from '@mui/material';

import SidebarMenu from '@layouts/SidebarLayout/Sidebar/V2SidebarMenu';

import { SidebarContext } from '@contexts/SidebarContext';

import Logo, { LogoImage } from '@components/LogoSign';
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

const SidebarPaper = styled(Paper)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    width: ${theme.sidebar.width};
    height: 1022px;
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

const Sidebar = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { workspaceId = null } = useWorkspaceId();

  const theme = useTheme();

  return (
    // <>
    //   <SidebarWrapper
    //     sx={{
    //       display: {
    //         xs: 'none',
    //         lg: 'inline-block'
    //       },
    //       position: 'fixed',
    //       left: 0,
    //       top: 0,
    //       background: theme.palette.mode === 'dark' ? theme.colors.alpha.white[100] : theme.colors.alpha.black[100],
    //       boxShadow: theme.palette.mode === 'dark' ? theme.sidebar.boxShadow : 'none'
    //     }}
    //   >
    //     <Box mt={1}>
    //       <Box>
    //         <Logo />
    //       </Box>
    //     </Box>
    //     <Divider
    //       sx={{
    //         mt: theme.spacing(2),
    //         mx: theme.spacing(2)
    //       }}
    //     />
    //     <SidebarMenu key={'SidebarMenu'} workspaceId={workspaceId} />
    //   </SidebarWrapper>
    //   <Drawer
    // sx={{
    //   boxShadow: `${theme.sidebar.boxShadow}`,
    //   bgcolor: 'greenyellow'
    // }}
    //     anchor={theme.direction === 'rtl' ? 'right' : 'left'}
    //     open={sidebarToggle}
    //     onClose={toggleSidebar}
    //     variant="temporary"
    //     elevation={9}
    //   >
    //     <SidebarWrapper
    //       sx={{
    //         background: theme.palette.mode === 'dark' ? theme.colors.alpha.white[100] : theme.colors.alpha.black[100]
    //       }}
    //     >
    //       <Box mt={3}>
    //         <Box
    //           mx={2}
    //           sx={{
    //             width: 52
    //           }}
    //         >
    //           <Logo />
    //         </Box>
    //       </Box>
    //       <Divider
    //         sx={{
    //           mt: theme.spacing(3),
    //           mx: theme.spacing(2),
    //           background: theme.colors.alpha.trueWhite[10]
    //         }}
    //       />
    //       <SidebarMenu key={'SidebarDrawer'} workspaceId={workspaceId} />
    //     </SidebarWrapper>
    //   </Drawer>
    // </>

    <SidebarPaper>
      <ImageBox>
        <LogoImage width={156.8} height={32} />
      </ImageBox>
      {/* <SidebarDivider sx={{ borderColor: 'white' }} /> */}
      {/* <SidebarMenu key={'SidebarDrawer'} workspaceId={workspaceId} /> */}
    </SidebarPaper>
  );
};

export default Sidebar;
