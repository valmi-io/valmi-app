// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:27:08 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Controller } from 'react-hook-form';

import FormFieldAuth from '@components/FormInput/FormFieldAuth';

import { FormObject, getInputField } from '@utils/form-utils';
interface FormFieldProps extends FormObject {
  hasAuthorizedOAuth?: boolean;
  oauth_error?: string;
  control: any;
  isConnectorConfigured?: boolean;
  isConfigurationRequired?: boolean;
  handleOnConfigureButtonClick: (data: any) => void;
}

const FormField = ({
  label,
  name,
  description,
  disabled,
  enumValue,
  oAuthProvider,
  required,
  type,
  fieldType,
  selectedConnector,
  onClick,
  isConnectorConfigured,
  isConfigurationRequired,
  handleOnConfigureButtonClick,
  hasAuthorizedOAuth,
  oauth_error,
  control
}: FormFieldProps) => {
  const getDefaultValue = (field: any, fieldName: any, fieldValue: any) => {
    if (!field.value) {
      if (isConnectorType(fieldName)) {
        return fieldValue;
      }
      return '';
    }

    return field.value;
  };

  const isConnectorType = (fieldName: string) => {
    if (fieldName === 'connector_type') return true;
    return false;
  };

  if (fieldType === 'auth') {
    return (
      <FormFieldAuth
        label={label}
        onClick={onClick}
        isConnectorConfigured={isConnectorConfigured}
        isConfigurationRequired={isConfigurationRequired}
        handleOnConfigureButtonClick={handleOnConfigureButtonClick}
        oAuthProvider={oAuthProvider}
        oauth_error={oauth_error}
        hasOAuthAuthorized={hasAuthorizedOAuth}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field, fieldState: { error } }): React.ReactElement | null => {
        return getInputField(
          field,
          description,
          error?.type === 'required' ? true : false,
          label,
          enumValue,
          required,
          disabled,
          getDefaultValue(field, name, selectedConnector),
          fieldType
        );
      }}
    />
  );
};

export default FormField;
