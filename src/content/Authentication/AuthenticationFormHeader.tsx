import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { Stack, Typography, styled } from '@mui/material';
import React from 'react';

const TextLayout = styled(Typography)(({}) => ({
  maxWidth: '520px'
}));

const authDescriptions: { [key: string]: string } = {
  true: 'Create your free Valmi account using your Google account. Sync your eCommerce data to Google Sheets, analyze and engage with your customers.',
  false: 'Sync your eCommerce data to Google Sheets, analyze and engage with your customers.'
};

const Logo = () => {
  return (
    <ImageComponent
      src={'/images/valmi_logo_text_black.svg'}
      alt="Logo"
      size={ImageSize.logo}
      style={{ height: '55px', width: '273px' }}
    />
  );
};

const AuthenticationFormHeader = ({ isUserNew }: { isUserNew: boolean }) => {
  const description = authDescriptions[isUserNew.toString()];

  return (
    <>
      <Stack alignItems="center">
        <Logo />
      </Stack>
      <TextLayout variant="body1">{description}</TextLayout>
    </>
  );
};

export default AuthenticationFormHeader;
