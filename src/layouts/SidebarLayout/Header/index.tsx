import { useContext } from 'react';

import { Box, IconButton, Tooltip } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import HeaderUserbox from '@layouts/SidebarLayout/Header/Userbox';

import { SidebarContext } from '@contexts/SidebarContext';

import Breadcrumb from '@components/Breadcrumb';
import { useRouter } from 'next/router';
import { getRouterPathname, isPublicSync } from '@utils/routes';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useSession } from 'next-auth/react';
import VButton from '@/components/VButton';
import Link from 'next/link';

function Header() {
  const router = useRouter();
  const query = router.query;
  const url = router.pathname;
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const { workspaceId = '' } = useWorkspaceId();
  const { data: session } = useSession();

  return (
    <>
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
              frameBorder="0"
              width="180"
              height="30"
              title="GitHub"
              style={{
                alignSelf: 'center'
              }}
            />

            {!session && !workspaceId ? (
              <Link href="/login">
                <VButton buttonText={'LOG IN'} buttonType="submit" size="small" disabled={false} />
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
    </>
  );
}

export default Header;
