/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 6:11:37 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Link, Typography, styled } from '@mui/material';

const InstructionsBox = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

export const InstructionsText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 400
}));

type InstructionsProps = {
  documentationUrl?: string;
  title?: string;
  linkText?: string;
  type?: 'credential' | 'sync' | 'stream' | 'destination' | 'track' | 'oauth' | 'analytics-destination';
};

const Instructions = (props: InstructionsProps) => {
  const { documentationUrl, title, linkText, type } = props;

  return (
    <InstructionsBox>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>

      <InstructionsText variant="body1">
        Refer to step-by-step instructions to setup a{' '}
        <Link color="secondary" href={documentationUrl} target="_blank" rel="noreferrer" underline="always">
          {linkText}
        </Link>
        {type && type === 'credential' && <> {'credential.'}</>}
      </InstructionsText>
    </InstructionsBox>
  );
};

export default Instructions;
