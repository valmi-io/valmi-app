import { Paper, keyframes, styled } from '@mui/material';
import { Box, Stack } from '@mui/system';
import Image from 'next/image';
import React from 'react';

const sources = [
  { id: 1, src: '/connectors/shopify.svg' },
  { id: 3, src: '/connectors/postgres.svg' },
  { id: 4, src: '/connectors/snowflake.svg' },
  { id: 5, src: '/connectors/redshift.svg' },
  { id: 6, src: '/connectors/shopify.svg' },
  { id: 7, src: '/connectors/facebook.svg' },
  { id: 8, src: '/connectors/postgres.svg' },
  { id: 4, src: '/connectors/snowflake.svg' }
];

const destinations = [
  { id: 1, src: '/connectors/google-sheets.svg' },
  { id: 2, src: '/connectors/slack.svg' },
  { id: 3, src: '/connectors/facebook-ads.svg' },
  { id: 4, src: '/connectors/android-push-notifications.svg' },
  { id: 5, src: '/connectors/facebook-conversions.svg' },
  { id: 6, src: '/connectors/ga4.svg' },
  { id: 7, src: '/connectors/google-ads.svg' },
  { id: 8, src: '/connectors/stripe.svg' },
  { id: 9, src: '/connectors/google-sheets.svg' }
];

const ContainerWrapper = styled(Paper)(({ theme }) => ({
  bgcolor: 'yellow',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden'
}));

const ParallelogramBox = styled(Paper)(({ theme }) => ({
  width: '180px',
  height: '150px',
  //   transform: 'skewX(-20deg)',
  overflow: 'hidden'
}));

const marquee = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const Logo = ({ src }: { src: any }) => {
  return <img src={src} alt="Company Logo" style={{ width: '100px', height: 'auto', display: 'inline-block' }} />;
};

const Carousel = ({ type }: { type: any }) => {
  return (
    <Stack
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: (theme) => theme.spacing(5),
          overflow: 'hidden',
          animation: `${marquee} 30s linear infinite`
        }}
      >
        {type.map((item: any) => (
          <Box key={item.id} sx={{ display: 'inline-block' }}>
            <Logo src={item.src} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

const LogoCarousel = () => {
  return (
    <ContainerWrapper>
      <ParallelogramBox variant="outlined">
        <Carousel type={destinations} />
      </ParallelogramBox>
      <Image
        src={'/images/valmi_logo_no_text.svg'}
        alt="Valmi.io Logo"
        width={90}
        height={90}
        // style={{ marginRight: '80px' }}
      />
      {/* <ParallelogramBox variant="outlined" sx={{ marginRight: (theme) => theme.spacing(20) }}> */}
      <ParallelogramBox variant="outlined">
        <Carousel type={sources} />
      </ParallelogramBox>
    </ContainerWrapper>
  );
};

export default LogoCarousel;
