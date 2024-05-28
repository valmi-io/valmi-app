// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 6:53:52 pm
 * Author: Nagendra S @ valmi.io
 */

import { useContext } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { Box, alpha, IconButton, Tooltip, styled, Button } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import HeaderUserbox from '@layouts/SidebarLayout/Header/Userbox';

import { SidebarContext } from '@contexts/SidebarContext';

import Breadcrumb from '@components/Breadcrumb';

import { getRouterPathname, isPublicSync } from '@utils/routes';
import { useLoginStatus } from '@/hooks/useLoginStatus';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(0, 2)};
        gap: ${theme.spacing(2)};
        height: ${theme.header.height};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        position: fixed;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const router = useRouter();
  const query = router.query;
  const url = router.pathname;

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { isLoggedIn } = useLoginStatus();

  return (
    <HeaderWrapper>
      <Breadcrumb />
      <Box display="flex" alignItems="center">
        {isPublicSync(getRouterPathname(query, url)) ? (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <iframe
              src="https://ghbtns.com/github-btn.html?user=valmi-io&repo=valmi-activation&type=star&count=true&size=large"
              width="180"
              height="30"
              title="GitHub"
              style={{
                alignSelf: 'center',
                border: 0
              }}
            />

            {!isLoggedIn ? (
              <Link href="/signup" passHref style={{ textDecoration: 'none' }}>
                <Button sx={{ fontWeight: 'bold', fontSize: 14 }} variant="contained">
                  Sign up
                </Button>
              </Link>
            ) : (
              <HeaderUserbox />
            )}
          </Box>
        ) : (
          <HeaderUserbox />
        )}
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon fontSize="small" /> : <CloseTwoToneIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
