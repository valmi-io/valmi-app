// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, October 18th 2023, 6:09:30 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box } from '@mui/material';

import { Controller } from 'react-hook-form';

import { FormObject, getInputField } from '@/utils/form-utils';
import AuthenticationSubmitButton from './AuthenticationSubmitButton';

const AuthenticationForm = ({
  fields,
  control,
  handleSubmit,
  onSubmit,
  isFetching,
  data,
  buttonText
}) => {
  return (
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
      {/** Display submit button  */}
      <AuthenticationSubmitButton
        isFetching={isFetching}
        data={data}
        buttonText={buttonText}
      />
    </Box>
  );
};

export default AuthenticationForm;
