// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect, useRef, useState } from 'react';

import { useDispatch } from 'react-redux';

import { Avatar, Box, Button, Divider, Hidden, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LogoutIcon from '@mui/icons-material/Logout';

import PopoverComponent from '@components/Popover';

import { signOutUser } from '@utils/lib';
import { AppDispatch } from '@/store/store';
import { useSession, signIn } from 'next-auth/react';
import { useLazyLogoutUserQuery } from '@/store/api/apiSlice';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(1, 2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        color: ${theme.colors.alpha.black[100]};
        display: block;
`
);

const UserAvatar = styled(Avatar)(({ theme }) => ({
  display: 'flex',
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.alpha.black[100]
}));

const HeaderUserbox = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // logout user query
  const [logoutUser] = useLazyLogoutUserQuery();

  const { data: session } = useSession();

  const { user } = useUser();

  const ref = useRef<any>(null);
  // Popover states
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      console.error('[userbox.tsx]: refresh access token error');
      signIn('google', { callbackUrl: '/' }); // Force sign in to hopefully resolve error
    }
  }, [session]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (): void => {
    setAnchorEl(null);
  };

  const handleSignoutClick = async (): void => {
    signOutUser(router, dispatch, logoutUser);
  };

  const userAvatar = () => {
    return (
      <UserAvatar src={user?.image}>
        <Typography variant="h6" sx={{ color: (theme) => theme.colors.alpha.white[100] }}>
          {user?.name[0]?.toLowerCase()}
        </Typography>
      </UserAvatar>
    );
  };

  const userTitle = () => {
    return (
      <UserBoxText>
        <UserBoxLabel variant="body1">{user?.name ?? 'valmi'}</UserBoxLabel>
      </UserBoxText>
    );
  };

  const userEmail = () => {
    return (
      <UserBoxText>
        <UserBoxLabel variant="body2">{user?.email ?? '@valmi.io'}</UserBoxLabel>
      </UserBoxText>
    );
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handlePopoverOpen}>
        {userAvatar()}

        <Hidden mdDown>{userTitle()}</Hidden>
        <Hidden smDown>
          <CustomIcon style={{ fontSize: 16, color: 'black', marginLeft: 16 }} icon={appIcons.CARET_DOWN} />
        </Hidden>
      </UserBoxButton>

      {Boolean(anchorEl) && (
        <PopoverComponent anchorEl={anchorEl} onClose={handlePopoverClose}>
          <MenuUserBox sx={{ minWidth: 210 }} display="flex" alignItems="center">
            {userAvatar()}
            {userEmail()}
          </MenuUserBox>

          <Divider />
          <Box sx={{ m: 1 }}>
            <Button color="primary" fullWidth onClick={handleSignoutClick}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sign out
            </Button>
          </Box>
        </PopoverComponent>
      )}
    </>
  );
};

export default HeaderUserbox;
