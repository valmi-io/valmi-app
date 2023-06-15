// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 2:52:54 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, styled, Stack, Container, Paper } from '@mui/material';
import { FormObject, getInputField } from '../../utils/form-utils';
import ImageComponent, { ImageSize } from '../../components/ImageComponent';

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

const AuthenticationLayout = (props) => {
  const { control, fields, handleSubmit, onSubmit } = props;

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

          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {
                mt: 1,
                mb: 1,
                width: '100%'
              }
            }}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            {fields.map((inputField: FormObject) => (
              <Controller
                key={inputField.name}
                name={inputField.name}
                control={control}
                defaultValue=""
                rules={{ required: inputField.required }}
                render={({ field, fieldState: { error } }) => {
                  return getInputField(
                    field,
                    inputField.description,
                    error ? true : false,
                    inputField.label,
                    inputField.enumValue,
                    inputField.required,
                    inputField.disabled,
                    !field.value ? '' : field.value,
                    inputField.fieldType,
                    null,
                    null,
                    null
                  );
                }}
              />
            ))}
            <Stack sx={{ mb: 1 }}>{props.children}</Stack>
          </Box>
        </Layout>
      </ContainerLayout>
    </Box>
  );
};

export default AuthenticationLayout;
