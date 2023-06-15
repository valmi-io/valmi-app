/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:10:48 pm
 * Author: Nagendra S @ valmi.io
 */

import { CheckOutlined } from '@mui/icons-material';
import { Box, InputLabel, styled } from '@mui/material';
import { getOauthImage } from '../../content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { capitalizeFirstLetter } from '../../utils/lib';
import { ErrorStatusText } from '../Error';
import ImageComponent, { ImageSize } from '../ImageComponent';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.success.contrastText
}));

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body2,
  margin: theme.spacing(1)
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
      <Item
        sx={{
          borderRadius: 1
        }}
        onClick={() =>
          onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) })
        }
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ImageComponent
            size={ImageSize.medium}
            alt="oauth icon"
            style={{
              marginRight: 20
            }}
            src={getOauthImage({
              oAuth: getOAuthProvider(oAuthProvider)
            })}
          />
          {`Sign in with ${capitalizeFirstLetter(
            getOAuthProvider(oAuthProvider)
          )}`}
        </Box>
        {hasOAuthAuthorized && (
          <Box sx={{ display: 'flex' }}>
            <CheckOutlined />
          </Box>
        )}
      </Item>
      <ErrorStatusText sx={{ ml: 1, fontSize: 14 }} variant="body1">
        {oauth_error}
      </ErrorStatusText>
    </>
  );
};

export default FormFieldAuth;
