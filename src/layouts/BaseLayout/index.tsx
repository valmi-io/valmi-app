/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  display: 'flex',
  flex: 1,
  height: '100%'
}));

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <BoxContainer>{children}</BoxContainer>;
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
