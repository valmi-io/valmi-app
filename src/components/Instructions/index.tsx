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
        Follow the step-by-step instructions to connect to{' '}
        <Link color="secondary" href={documentationUrl} target="_blank" rel="noreferrer" underline="always">
          {linkText}
        </Link>
        {/* {type && type === 'credential' && <> {'credential.'}</>} */}
      </InstructionsText>
    </InstructionsBox>
  );
};

export default Instructions;
