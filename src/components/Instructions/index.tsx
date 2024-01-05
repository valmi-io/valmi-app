/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 6:11:37 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, CardHeader, Divider, Link, Typography, styled } from '@mui/material';

const InstructionsBox = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

export const InstructionsHeader = styled(CardHeader)(({}) => ({
  paddingLeft: 0
}));

export const InstructionsText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 400
}));

type InstructionsProps = {
  documentationUrl?: string;
  title?: string;
  linkText?: string;
  type?: 'connection' | 'sync' | 'stream' | 'destination' | 'track';
};

const Instructions = (props: InstructionsProps) => {
  const { documentationUrl, title, linkText, type } = props;

  return (
    <InstructionsBox>
      <InstructionsHeader title={title} />
      <Divider />
      <InstructionsText variant="body1">
        Refer to step-by-step instructions to setup a{' '}
        <Link href={documentationUrl} target="_blank" rel="noreferrer" underline="always">
          {linkText}
        </Link>
        {type && type === 'connection' && <> {'connection.'}</>}
      </InstructionsText>
    </InstructionsBox>
  );
};

export default Instructions;
