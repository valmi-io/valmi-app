// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 2:52:54 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState } from 'react';

import { Box, styled, Stack, Typography, Paper, Button } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import AuthenticationFormFooter from '@/content/Authentication/AuthenticationFormFooter';
import { GoogleSignInButton } from '@/components/AuthButtons';
import { JsonForms } from '@jsonforms/react';
import { materialCells } from '@jsonforms/material-renderers';
import { jsonFormValidator } from '@/utils/form-utils';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    promotion: {
      type: 'boolean',
      title: 'Check to receive latest product updates over email'
    },
    role: {
      type: 'string',
      title: 'You are part of',
      enum: ['Engineering', 'Marketing', 'Other'],
      enumNames: ['Engineering', 'Marketing', 'Other']
    }
  },
  required: ['promotion', 'role']
};

const ContainerLayout = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  Width: '100%',
  height: '100%',
  minHeight: '364.25px',
  minWidth: '440px',
  padding: 0,
  gap: theme.spacing(2),
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const DetailBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'center',
  Width: '100%',
  height: '100%',
  padding: theme.spacing(2, 8),
  gap: theme.spacing
}));

const TextLayout = styled(Typography)(({ theme }) => ({
  color: theme.colors.primary.dark,
  display: 'block'
}));

const FormLayout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
}));

const AuthenticationLayout = () => {
  const initialData = {};
  const [data, setData] = useState<any>(initialData);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });
  const { valid, errors } = jsonFormValidator(schema, data);

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };
  return (
    <ContainerLayout>
      <DetailBox sx={isNewUser ? { justifyContent: 'center' } : { justifyContent: 'space-evenly' }}>
        {/** valmi - logo */}
        <Stack alignItems="center">
          <ImageComponent
            src={'/images/valmi_logo_text_black.svg'}
            alt="Logo"
            size={ImageSize.logo}
            style={{ height: '55px', width: '273px' }}
          />
        </Stack>
        <TextLayout variant="body1">
          {isNewUser
            ? 'Create your free Valmi account using your Google account. Sync your eCommerce data to Google Sheets,analyze and engage with your customers.'
            : 'Sync your eCommerce data to Google Sheets, analyze and engage with your customers.'}
        </TextLayout>
        {isNewUser && (
          <FormLayout>
            <JsonForms
              schema={schema}
              data={data}
              renderers={customRenderers}
              cells={materialCells}
              onChange={handleFormChange}
            />
          </FormLayout>
        )}
        <Stack sx={{ width: '100%' }}>
          <Button disabled={isNewUser && !valid} fullWidth sx={{ padding: 0 }}>
            <GoogleSignInButton />
          </Button>
          <Button onClick={() => setIsNewUser(!isNewUser)} sx={{ alignSelf: 'flex-end', padding: 1 }}>
            <AuthenticationFormFooter
              footerText={isNewUser ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            />
          </Button>
        </Stack>
      </DetailBox>
    </ContainerLayout>
  );
};

export default AuthenticationLayout;
