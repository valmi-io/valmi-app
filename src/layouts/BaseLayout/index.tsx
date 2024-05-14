/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Stack, styled } from '@mui/material';
import GridLayout from '@/components/grid';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BoxContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  height: '100%',
  padding: theme.spacing(0, 8)
}));

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <BoxContainer>{children}</BoxContainer>;
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
