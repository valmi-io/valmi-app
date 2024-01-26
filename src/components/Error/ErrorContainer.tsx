/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 24th 2023, 5:27:17 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, styled } from '@mui/material';
import ErrorComponent from '.';

const BoxLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(1)
}));

const ErrorContainer = ({ error }: any) => {
  return (
    <BoxLayout>
      <ErrorComponent error={error} />
    </BoxLayout>
  );
};

export default ErrorContainer;
