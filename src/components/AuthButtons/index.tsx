import { signIn, signOut, useSession } from 'next-auth/react';
import { Box, Paper, Typography } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import styled from '@emotion/styled';
import { setCookie } from '@/lib/cookies';

const PaperWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '41px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1px 10px 1px 1px',
  gap: '10px',
  border: '1px solid rgba(0, 0, 0, 0.5)',
  boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.084), 0px 1px 1px rgba(0, 0, 0, 0.168)',
  cursor: 'pointer',
  borderRadius: theme.spacing(0.4)
}));

export function GoogleSignInButton({ meta = {} }: { meta: any }) {
  const { data: session } = useSession();

  const handleClick = () => {
    if (session) {
      signOut();
    } else {
      setCookie(
        'additionalAuthParams',
        JSON.stringify({
          meta: meta
        })
      );
      signIn('google', {
        callbackUrl: '/'
      });
    }
  };
  return (
    <PaperWrapper onClick={handleClick}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {' '}
        <ImageComponent
          size={ImageSize.medium}
          alt="oauth icon"
          src={getOauthImage({
            oAuth: 'google'
          })}
        />{' '}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'black'
          }}
        >
          {session
            ? 'Logout'
            : getOauthLoginText({
                oAuth: 'google'
              })}
        </Typography>
      </Box>
    </PaperWrapper>
  );
}
