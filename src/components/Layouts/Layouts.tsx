/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 15th 2023, 6:33:08 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Stack, styled } from '@mui/material';

export const BoxLayout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2
}));

export const StackLayout = styled(Stack)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2)
}));

export const SkeletonLayout = styled(Box)(({}) => ({
  width: '50%'
}));
