// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import authStorage from '../../../../utils/auth-storage';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../store/store';
import { RootState } from '../../../../store/reducers';
import { signOutUser, stringAvatar } from '../../../../utils/lib';
import PopoverComponent from '../../../../components/Popover';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
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

const HeaderUserbox = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const ref = useRef<any>(null);
  // Popover states
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleSignoutClick = (): void => {
    signOutUser(authStorage, dispatch, router);
  };

  const userAvatar = () => {
    return (
      <Avatar
        sx={{ width: 30, height: 30 }}
        {...stringAvatar(user?.email ? user.email : 'valmi.io')}
      />
    );
  };

  const userTitle = () => {
    return (
      <UserBoxText>
        <UserBoxLabel variant="body2">
          {user?.email ? user.email : 'valmi.io'}
        </UserBoxLabel>
      </UserBoxText>
    );
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        {userAvatar()}

        <Hidden mdDown>{userTitle()}</Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon className="black-bg" sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>

      {Boolean(anchorEl) && (
        <PopoverComponent anchorEl={anchorEl} handleClose={handleClose}>
          <MenuUserBox
            sx={{ minWidth: 210 }}
            display="flex"
            alignItems="center"
          >
            {userAvatar()}
            {userTitle()}
          </MenuUserBox>

          <Divider />
          <Box sx={{ m: 1 }}>
            <Button color="primary" fullWidth onClick={handleSignoutClick}>
              <LockOpenTwoToneIcon sx={{ mr: 1 }} />
              Sign out
            </Button>
          </Box>
        </PopoverComponent>
      )}
    </>
  );
};

export default HeaderUserbox;
