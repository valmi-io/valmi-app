/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 6:53:09 pm
 * Author: Nagendra S @ valmi.io
 */

import { Typography, styled } from '@mui/material';
import { getErrorsInErrorObject } from './ErrorUtils';

export const ErrorStatusText = styled(Typography)(({ theme }) => ({
  color: theme.colors.error.main
}));

type ErrorComponentProps = {
  error?: any;
};

const ErrorComponent = (props: ErrorComponentProps) => {
  const { error } = props;

  const errors = getErrorsInErrorObject(error);

  const { status = '', message = '' } = errors || {};
  return (
    <>
      <ErrorStatusText variant="body1">{status}</ErrorStatusText>
      <ErrorStatusText variant="body2">{message}</ErrorStatusText>{' '}
    </>
  );
};

export default ErrorComponent;
