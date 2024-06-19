//@ts-nocheck
import React from 'react';
import { CircularProgress, styled, Stack } from '@mui/material';

// Custom styled CircularProgress component
const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  width: 45,
  height: 45,
  aspectRatio: '1',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
    animation: '$loading 1s infinite linear'
  },
  '@keyframes loading': {
    '20%': {
      background:
        'no-repeat linear-gradient(#333 0 0) 0% 50%, no-repeat linear-gradient(#333 0 0) 50% 50%, no-repeat linear-gradient(#333 0 0) 100% 50%',
      backgroundSize: '20% 50%'
    },
    '40%': {
      background:
        'no-repeat linear-gradient(#333 0 0) 0% 100%, no-repeat linear-gradient(#333 0 0) 50% 0%, no-repeat linear-gradient(#333 0 0) 100% 50%',
      backgroundSize: '20% 50%'
    },
    '60%': {
      background:
        'no-repeat linear-gradient(#333 0 0) 0% 50%, no-repeat linear-gradient(#333 0 0) 50% 100%, no-repeat linear-gradient(#333 0 0) 100% 0%',
      backgroundSize: '20% 50%'
    },
    '80%': {
      background:
        'no-repeat linear-gradient(#333 0 0) 0% 50%, no-repeat linear-gradient(#333 0 0) 50% 50%, no-repeat linear-gradient(#333 0 0) 100% 100%',
      backgroundSize: '20% 50%'
    }
  }
}));

const Spinner = () => {
  return (
    <Stack
      position="absolute"
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgcolor="rgba(0, 0, 0, 0.3)" // Semi-transparent grey overlay
      backdropFilter="blur(4px)" // Apply backdrop blur effect
      zIndex={9999} // Ensure the spinner appears above other content
    >
      <StyledCircularProgress />
    </Stack>
  );
};

export default Spinner;
