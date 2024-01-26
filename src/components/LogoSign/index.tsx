/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const LogoWrapper = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'flex',
  textDecoration: 'none',
  margin: '0 auto',
  paddingLeft: theme.spacing(2),
  fontWeight: theme.typography.fontWeightBold
}));

function Logo() {
  return (
    <LogoWrapper href="/">
      <Image
        priority={true}
        src="/images/valmi_logo_text_white.svg"
        alt="Logo"
        width={140}
        height={40}
      />
    </LogoWrapper>
  );
}

export default Logo;
