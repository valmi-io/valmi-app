import { signIn } from 'next-auth/react';
import { Box, Typography } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn('google');
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 60,
        padding: 1,
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
        borderRadius: 1
      }}
      onClick={handleClick}
    >
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
          {' '}
          {getOauthLoginText({
            oAuth: 'google'
          })}
        </Typography>
      </Box>
    </Box>
  );
}
