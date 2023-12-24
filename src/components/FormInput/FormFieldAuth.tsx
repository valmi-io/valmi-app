/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:10:48 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, IconButton, InputLabel, Typography, styled } from '@mui/material';

import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '@content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';

import { ErrorStatusText } from '@components/Error';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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

const getOAuthProvider = (oAuthProvider: any) => {
  return oAuthProvider.split('$$')[0];
};

const FormFieldAuth = (props: any) => {
  const {
    label,
    onClick,
    oAuthProvider,
    hasOAuthAuthorized,
    oauth_error = ''
  } = props;

  return (
    <>
      <Label>{label}</Label>
      <Item>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: getOAuthProvider(oAuthProvider) !== 'google' ? 1 : 0,
            borderRadius:
              getOAuthProvider(oAuthProvider) !== 'google' ? 0.5 : 0,
            height: 50,
            backgroundColor: getOauthColorCode({
              oAuth: getOAuthProvider(oAuthProvider)
            }),
            boxShadow:
              getOAuthProvider(oAuthProvider) === 'hubspot'
                ? '0px 0px 3px rgba(0, 0, 0, 0.4)'
                : 0,
            width: '100%'
          }}
          onClick={() =>
            onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) })
          }
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
              color:
                getOAuthProvider(oAuthProvider) === 'hubspot'
                  ? 'black'
                  : 'white'
            }}
          >
            {' '}
            {getOauthLoginText({
              oAuth: getOAuthProvider(oAuthProvider)
            })}
          </Typography>
        </Box>
        {hasOAuthAuthorized && (
          <IconButton color={'primary'}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </IconButton>
        )}
      </Item>

      <ErrorStatusText sx={{ ml: 1, fontSize: 14 }} variant="body1">
        {oauth_error}
      </ErrorStatusText>
    </>
  );
};

export default FormFieldAuth;
