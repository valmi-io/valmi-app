// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 23rd 2023, 5:53:45 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  styled
} from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import SkeletonLoader from '@components/SkeletonLoader';
import { ErrorStatusText } from '@components/Error';

import { RootState } from '@store/reducers';
import { setAppState } from '@store/reducers/appFlow';

const Layout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: theme.colors.alpha.white[100],
  paddingBottom: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  borderRadius: 10
}));

const ContainerLayout = styled(Container)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

type ActivationComponentProps = {
  isLoading?: boolean;
  cardTitle?: string;
  cardDescription?: string;
  enableLogin?: boolean;
  isError?: boolean;
};

const ActivationComponent = (props: ActivationComponentProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { isLoading, cardTitle, cardDescription, enableLogin, isError } = props;

  const redirectHandler = () => {
    dispatch(
      setAppState({
        ...appState,
        loginFlowState: {}
      })
    );
    if (isError) {
      router.push('/signup');
    } else {
      router.push('/login');
    }
  };

  const getRedirectButtonText = () => {
    if (isError) return 'Click here to sign up';
    return 'Click here to login';
  };

  const displayContent = () => {
    return (
      <Stack spacing={4}>
        <Box>
          {isError ? (
            <ErrorStatusText align="center" variant="h3">
              {cardTitle}
            </ErrorStatusText>
          ) : (
            <Typography align="center" variant="h3">
              {cardTitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          {isError ? (
            <ErrorStatusText variant="body1">{cardDescription}</ErrorStatusText>
          ) : (
            <Typography
              variant="body1"
              component="div"
              dangerouslySetInnerHTML={{ __html: cardDescription }}
            />
          )}
        </Box>
        {enableLogin && (
          <Button size="large" variant="contained" onClick={redirectHandler}>
            {getRedirectButtonText()}
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ContainerLayout maxWidth="sm">
        <Layout>
          {/** valmi - logo */}
          <Stack alignItems="center">
            <ImageComponent
              src={'/images/valmi_logo_text_black.svg'}
              alt="Logo"
              size={ImageSize.logo}
            />
          </Stack>
          <Stack sx={{ mb: 1 }}>
            <SkeletonLoader loading={isLoading} />

            {!isLoading && displayContent()}
          </Stack>
        </Layout>
      </ContainerLayout>
    </Box>
  );
};

export default ActivationComponent;
