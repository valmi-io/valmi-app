// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:37:50 pm
 * Author: Nagendra S @ valmi.io
 */

import FormFieldPassword from '@components/FormInput/FormFieldPasword';
import FormFieldText from '@components/FormInput/FormFieldText';

export type FormObject = {
  label: string;
  name: string;
  type: string;
  description: string;
  enumValue: any;
  oAuthProvider: string;
  required: boolean;
  disabled: boolean;
  fieldType: string;
  onClick?: (data: any) => void;
  fileInputRef?: React.Ref<HTMLInputElement>;
  handleUploadButtonClick?: () => void;
  handleFileChange?: (data: any) => void;
  selectedConnector?: string;
  selected_file?: string;
};

export const createNewField = ({
  name,
  label,
  type,
  description,
  enumValue,
  oAuthProvider,
  required,
  disabled,
  fieldType
}) => {
  return {
    name,
    label,
    type,
    description,
    enumValue,
    oAuthProvider,
    required,
    disabled,
    fieldType
  };
};

export const getInputField = (
  field,
  description,
  error,
  label,
  enumValue,
  required,
  disabled,
  value,
  fieldType,
  fileInputRef,
  handleFileChange,
  handleUploadButtonClick
) => {
  switch (fieldType) {
    case 'text':
    case 'string':
    case 'email':
    case 'array':
    case 'select':
    case 'object':
      return (
        <FormFieldText
          field={field}
          description={description}
          label={label}
          type="text"
          select={fieldType === 'select' ? true : false}
          values={enumValue}
          required={required}
          disabled={disabled}
          mulitline={fieldType === 'object' ? true : false}
          error={error}
          value={value}
          onChange={(event) => field.onChange(event.target.value)}
        />
      );

    case 'number':
    case 'integer':
      return (
        <FormFieldText
          field={field}
          description={description}
          label={label}
          type="number"
          required={required}
          disabled={disabled}
          error={error}
          value={value}
          onChange={(event) => field.onChange(parseInt(event.target.value))}
        />
      );

    case 'password':
      return (
        <FormFieldPassword
          field={field}
          description={description}
          label={label}
          required={required}
          disabled={disabled}
          error={error}
          value={value}
          onChange={(event) => field.onChange(event.target.value)}
        />
      );

    default:
      return null;
  }
};

export const getUsernameField = () => {
  return createNewField({
    name: 'username',
    label: 'Username',
    type: 'string',
    description: '',
    enumValue: null,
    oAuthProvider: '',
    required: true,
    disabled: false,
    fieldType: 'string'
  });
};

export const getEmailField = () => {
  return createNewField({
    name: 'email',
    label: 'Email',
    type: 'string',
    description: '',
    enumValue: null,
    oAuthProvider: '',
    required: true,
    disabled: false,
    fieldType: 'string'
  });
};

export const getPasswordField = () => {
  return createNewField({
    name: 'password',
    label: 'Password',
    type: 'string',
    description: '',
    enumValue: null,
    oAuthProvider: '',
    required: true,
    disabled: false,
    fieldType: 'password'
  });
};
