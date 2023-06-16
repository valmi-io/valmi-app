/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:10:48 pm
 * Author: Nagendra S @ valmi.io
 */

import { CheckOutlined } from '@mui/icons-material';
import { Box, IconButton, InputLabel, styled } from '@mui/material';
import {
  getOauthColorCode,
  getOauthImage,
  getOauthLoginText
} from '../../content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { capitalizeFirstLetter } from '../../utils/lib';
import { ErrorStatusText } from '../Error';
import ImageComponent, { ImageSize } from '../ImageComponent';
import FontAwesomeIcon from '../Icon/FontAwesomeIcon';
import Image from 'next/image';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  //padding: theme.spacing(1),
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  margin: theme.spacing(1),
  //backgroundColor: '#5890FF',
  // backgroundColor: theme.palette.primary.main,
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
        sx={
          {
            // borderRadius: 1
            // backgroundColor: 'orange'
            // backgroundColor: getOauthColorCode({
            //   oAuth: getOAuthProvider(oAuthProvider)
            // })
          }
        }
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            //padding: 1,
            // borderRadius: 1,
            height: 50,
            //justifyContent: 'center',
            backgroundColor: getOauthColorCode({
              oAuth: getOAuthProvider(oAuthProvider)
            }),
            width: '100%'
          }}
          onClick={() =>
            onClick({ oAuthProvider: getOAuthProvider(oAuthProvider) })
          }
        >
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              width: 50,
              backgroundColor: 'white',
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
          {getOauthLoginText({
            oAuth: getOAuthProvider(oAuthProvider)
          })}
        </Box>
        {hasOAuthAuthorized && (
          <IconButton color={'primary'}>
            <FontAwesomeIcon className={`fas fa-check-circle`} />
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
