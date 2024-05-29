import { signIn, useSession } from 'next-auth/react';
import { Box, Paper, Typography, styled } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { getOauthImage, getOauthLoginText } from '@/content/ConnectionFlow/ConnectionConfig/ConnectionConfigUtils';
import { getAuthMetaCookie, getCookie, setCookie } from '@/lib/cookies';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { AppFlowState, setAppState } from '@/store/reducers/appFlow';
import { RootState } from '@/store/reducers';

const PaperWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '41px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1px 10px 1px 1px',
  gap: '10px',
  // border: '1px solid rgba(0, 0, 0, 0.5)',
  boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.084), 0px 1px 1px rgba(0, 0, 0, 0.168)',
  // cursor: 'pointer',
  borderRadius: theme.spacing(0.4)
}));

export function GoogleSignInButton({ isDisabled, meta = {} }: { meta: any; isDisabled: boolean }) {
  const { data: session } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const handleClick = async () => {
    const { meta = null } = (await getCookie(getAuthMetaCookie())) ?? '';

    if (!meta) {
      setCookie(getAuthMetaCookie(), JSON.stringify({ meta: meta }));
    }

    dispatch(
      setAppState({
        ...appState,
        loginFlowState: 'INITIALIZED'
      })
    );

    signIn('google', {
      callbackUrl: '/'
      // redirect: false
    });
  };

  return (
    <PaperWrapper
      onClick={handleClick}
      sx={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: isDisabled ? '1px solid rgba(0, 0, 0, 0.2)' : '1px solid rgba(0, 0, 0, 0.5)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: 60,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : 1
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
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'black',
            opacity: isDisabled ? 0.5 : 0.6
          }}
        >
          {getOauthLoginText({
            oAuth: 'google'
          })}
        </Typography>
      </Box>
    </PaperWrapper>
  );
}
