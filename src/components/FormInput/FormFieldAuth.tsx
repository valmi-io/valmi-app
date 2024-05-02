/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:10:48 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Button, IconButton, InputLabel, Stack, Tooltip, Typography, styled } from '@mui/material';

import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '@content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';

import { ErrorStatusText } from '@components/Error';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

import CustomIcon from '@components/Icon/CustomIcon';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { OAuthContext } from '@/contexts/OAuthContext';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,

  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  color: theme.palette.success.contrastText
}));

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body2,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const getOAuthProvider = (oAuthProvider: any = '') => {
  return oAuthProvider.includes('$$') ? oAuthProvider.split('$$')[0] : oAuthProvider;
};

const FormFieldAuth = (props: any) => {
  const {
    label,
    onClick,
    oAuthProvider,
    hasOAuthAuthorized,
    oauth_error = '',
    isConnectorConfigured,
    isConfigurationRequired,
    handleOnConfigureButtonClick
  } = props;
  const { oAuthConfigData } = useContext(OAuthContext);
  const { isconfigured, requireConfiguration, isAuthorized, formValues } = oAuthConfigData;
  const { credentials, ...otherFormData } = formValues;

  return (
    <>
      <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
        <Label>{label}</Label>
        {requireConfiguration ? (
          !isconfigured ? (
            <Button
              sx={{ mt: { xs: 2, md: 0 }, fontWeight: 500, fontSize: 14 }}
              variant="text"
              size="small"
              onClick={() => handleOnConfigureButtonClick({ oAuthProvider: getOAuthProvider(oAuthProvider) })}
            >
              {'Configure'}
            </Button>
          ) : (
            isAuthorized && (
              <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
                <IconButton color={'primary'}>
                  <CustomIcon icon={faCheckCircle} />
                </IconButton>
              </Stack>
            )
          )
        ) : (
          isAuthorized && (
            <Stack sx={{ display: 'flex', flexDirection: 'row', bgcolor: 'red' }}>
              <IconButton color={'primary'}>
                <CustomIcon icon={faCheckCircle} />
              </IconButton>
            </Stack>
          )
        )}
      </Stack>
      <Item>
        <Tooltip title={requireConfiguration && !isconfigured ? 'This OAuth requires configuration' : ''}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: getOAuthProvider(oAuthProvider) !== 'google' ? 1 : 0,
              borderRadius: getOAuthProvider(oAuthProvider) !== 'google' ? 0.5 : 0,
              height: 50,
              backgroundColor: getOauthColorCode({
                oAuth: getOAuthProvider(oAuthProvider)
              }),
              cursor:
                requireConfiguration && !isconfigured
                  ? 'not-allowed'
                  : getOAuthProvider(oAuthProvider) !== 'shopify'
                  ? 'pointer'
                  : 'shop' in otherFormData && otherFormData.shop !== undefined
                  ? 'pointer'
                  : 'not-allowed',
              boxShadow: getOAuthProvider(oAuthProvider) === 'hubspot' ? '0px 0px 3px rgba(0, 0, 0, 0.4)' : 0,
              width: '100%',
              opacity:
                requireConfiguration && !isconfigured
                  ? 0.7
                  : getOAuthProvider(oAuthProvider) !== 'shopify'
                  ? 1
                  : 'shop' in otherFormData && otherFormData.shop !== undefined
                  ? 1
                  : 0.7
            }}
            onClick={() => {
              if (!requireConfiguration) {
                onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
              } else if (isconfigured && getOAuthProvider(oAuthProvider) !== 'shopify') {
                onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
              } else if (
                isconfigured &&
                getOAuthProvider(oAuthProvider) === 'shopify' &&
                'shop' in otherFormData &&
                otherFormData.shop !== undefined
              ) {
                onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) });
              }
              return null;
            }}
          >
            {getOAuthProvider(oAuthProvider) === 'google' ? (
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
                {' '}
                <ImageComponent
                  size={ImageSize.medium}
                  alt="oauth icon"
                  src={getOauthImage({
                    oAuth: getOAuthProvider(oAuthProvider)
                  })}
                />{' '}
              </Box>
            ) : (
              <ImageComponent
                size={ImageSize.medium}
                alt="oauth icon"
                style={{ marginRight: 10 }}
                src={getOauthImage({
                  oAuth: getOAuthProvider(oAuthProvider)
                })}
              />
            )}

            <Typography
              variant="body1"
              sx={{
                color: getOAuthProvider(oAuthProvider) === 'hubspot' ? 'black' : 'white'
              }}
            >
              {' '}
              {getOauthLoginText({
                oAuth: getOAuthProvider(oAuthProvider)
              })}
            </Typography>
          </Box>
        </Tooltip>
      </Item>

      <ErrorStatusText sx={{ ml: 1, fontSize: 14 }} variant="body1">
        {oauth_error}
      </ErrorStatusText>
    </>
  );
};

export default FormFieldAuth;
