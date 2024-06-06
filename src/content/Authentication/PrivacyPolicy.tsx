import { Link, Stack, Typography } from '@mui/material';

const PrivacyPolicy = ({ isUserNew }: { isUserNew: boolean }) => {
  return (
    <Stack sx={{ alignSelf: 'start' }}>
      <Typography variant="body1">
        By signing {isUserNew ? 'up' : 'in'}, you agree to Valmi.io's
        <Link sx={{ ml: 1 }} href="https://www.valmi.io/privacy-policy">
          Privacy Policy
        </Link>{' '}
      </Typography>
    </Stack>
  );
};

export default PrivacyPolicy;
