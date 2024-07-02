import { Box, Button, IconButton, Stack, Tooltip, Typography, styled } from '@mui/material';

import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '@/content/ConnectionFlow/ConnectionConfig/ConnectionConfigUtils';

import { ErrorStatusText } from '@components/Error';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

import CustomIcon from '@components/Icon/CustomIcon';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useContext } from 'react';
import { OAuthContext } from '@/contexts/OAuthContext';

const getOAuthProvider = (oAuthProvider: any = '') => {
  return oAuthProvider.includes('$$') ? oAuthProvider.split('$$')[0] : oAuthProvider;
};

const GoogleLoginButton = ({ oAuthProvider }: { oAuthProvider: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: 50,
        backgroundColor: '#fff',
        border: '1px solid #4285F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3
      }}
    >
      <ImageComponent
        size={ImageSize.medium}
        alt="oauth icon"
        src={getOauthImage({
          oAuth: getOAuthProvider(oAuthProvider)
        })}
      />
    </Box>
  );
};

const CatalogLogo = ({ oAuthProvider }: { oAuthProvider: string }) => {
  const provider = getOAuthProvider(oAuthProvider);
  if (provider === 'google') return <GoogleLoginButton oAuthProvider={oAuthProvider} />;

  return (
    <ImageComponent
      size={ImageSize.medium}
      alt="oauth icon"
      src={getOauthImage({
        oAuth: getOAuthProvider(oAuthProvider)
      })}
    />
  );
};

const CatalogLoginText = ({ oAuthProvider }: { oAuthProvider: string }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        ml: 1,
        mt: 0.5,
        color: (theme) =>
          getOAuthProvider(oAuthProvider) === 'hubspot' || 'shopify'
            ? theme.colors.alpha.black[100]
            : theme.colors.alpha.white[100],
        fontWeight: 500
      }}
    >
      {getOauthLoginText({
        oAuth: getOAuthProvider(oAuthProvider)
      })}
    </Typography>
  );
};

const CatalogAuthorized = () => {
  return (
    <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
      <IconButton color={'secondary'}>
        <CustomIcon icon={faCheckCircle} />
      </IconButton>
    </Stack>
  );
};

const getTooltipTitle = ({
  requireConfiguration,
  isConfigured
}: {
  requireConfiguration: boolean;
  isConfigured: boolean;
}) => {
  return <p>{requireConfiguration && !isConfigured ? 'This OAuth requires configuration' : ''}</p>;
};

const ConfiguredButton = styled(Button)(({ theme }) => ({
  //   fontWeight: 500,
  //   fontSize: 14
}));

const CatalogNotConfigured = ({
  oAuthProvider,
  handleOnConfigureButtonClick
}: {
  oAuthProvider: string;
  handleOnConfigureButtonClick: any;
}) => {
  const handleOnClick = useCallback(() => {
    handleOnConfigureButtonClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
  }, [oAuthProvider]);

  return (
    <ConfiguredButton
      sx={{ mt: { xs: 2, md: 0 } }}
      variant="text"
      color="secondary"
      size="small"
      onClick={handleOnClick}
    >
      {'Configure'}
    </ConfiguredButton>
  );
};

const Header = ({
  label,
  requireConfiguration,
  isConfigured,
  isAuthorized,
  oAuthProvider,
  handleOnConfigureButtonClick
}: {
  label: string;
  requireConfiguration: boolean;
  isConfigured: boolean;
  isAuthorized: boolean;
  oAuthProvider: string;
  handleOnConfigureButtonClick: any;
}) => {
  return (
    <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
      {requireConfiguration ? (
        !isConfigured ? (
          <CatalogNotConfigured
            oAuthProvider={oAuthProvider}
            handleOnConfigureButtonClick={handleOnConfigureButtonClick}
          />
        ) : (
          isAuthorized && <CatalogAuthorized />
        )
      ) : (
        isAuthorized && <CatalogAuthorized />
      )}
    </Stack>
  );
};

const LoginContainer = ({
  requireConfiguration,
  isConfigured,
  oAuthProvider,
  onClick,
  formData
}: {
  oAuthProvider: string;
  requireConfiguration: boolean;
  isConfigured: boolean;
  formData: any;
  onClick: any;
}) => {
  const handleOnClick = useCallback(() => {
    if (!requireConfiguration) {
      onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
    } else if (isConfigured && getOAuthProvider(oAuthProvider) !== 'shopify') {
      onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
    } else if (
      isConfigured &&
      getOAuthProvider(oAuthProvider) === 'shopify' &&
      'shop' in formData &&
      formData.shop !== undefined
    ) {
      onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
    }
    return null;
  }, [oAuthProvider]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: getOAuthProvider(oAuthProvider) !== 'google' ? 1 : 0,
        borderRadius: getOAuthProvider(oAuthProvider) !== 'google' ? 0.5 : 0,
        backgroundColor: getOauthColorCode({
          oAuth: getOAuthProvider(oAuthProvider)
        }),

        height: 50,

        cursor:
          requireConfiguration && !isConfigured
            ? 'not-allowed'
            : getOAuthProvider(oAuthProvider) !== 'shopify'
            ? 'pointer'
            : 'shop' in formData && formData.shop !== undefined
            ? 'pointer'
            : 'not-allowed',
        boxShadow: getOAuthProvider(oAuthProvider) === 'hubspot' || 'shopify' ? '0px 0px 3px rgba(0, 0, 0, 0.4)' : 0,
        width: '100%',
        opacity:
          requireConfiguration && !isConfigured
            ? 0.7
            : getOAuthProvider(oAuthProvider) !== 'shopify'
            ? 1
            : 'shop' in formData && formData.shop !== undefined
            ? 1
            : 0.7
      }}
      onClick={handleOnClick}
    >
      <CatalogLogo oAuthProvider={oAuthProvider} />

      <CatalogLoginText oAuthProvider={oAuthProvider} />
    </Box>
  );
};

const ConnectionLoginButton = (props: any) => {
  const {
    label,
    onClick,
    oAuthProvider,
    hasOAuthAuthorized: isAuthorized,
    oauth_error = '',
    isConnectorConfigured: isConfigured,
    isConfigurationRequired: requireConfiguration,
    handleOnConfigureButtonClick
  } = props;

  const { formState } = useContext(OAuthContext);

  const { credentials, ...formData } = formState;

  return (
    <Stack sx={{ mt: 0.5, mx: 0.3 }}>
      <Header
        handleOnConfigureButtonClick={handleOnConfigureButtonClick}
        isAuthorized={isAuthorized}
        isConfigured={isConfigured}
        label={label}
        oAuthProvider={oAuthProvider}
        requireConfiguration={requireConfiguration}
      />

      <Tooltip title={getTooltipTitle({ requireConfiguration, isConfigured })}>
        <>
          <LoginContainer
            onClick={onClick}
            isConfigured={isConfigured}
            formData={formData}
            oAuthProvider={oAuthProvider}
            requireConfiguration={requireConfiguration}
          />
        </>
      </Tooltip>

      <ErrorStatusText sx={{ ml: 1 }} variant="body1">
        {oauth_error}
      </ErrorStatusText>
    </Stack>
  );
};

export default ConnectionLoginButton;
