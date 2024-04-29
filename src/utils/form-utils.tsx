// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:37:50 pm
 * Author: Nagendra S @ valmi.io
 */

import FormFieldPassword from '@components/FormInput/FormFieldPasword';
import FormFieldText from '@components/FormInput/FormFieldText';
import { createAjv } from '@jsonforms/core';
import Ajv from 'ajv';

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

  selectedConnector?: string;
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

export const getInputField = (field, description, error, label, enumValue, required, disabled, value, fieldType) => {
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

// jsonforms input control tester
export const inputControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];

  const dataType = schema?.properties?.[controlName]?.type;

  const isEnumType = schema?.properties?.[controlName]?.enum;
  if (isEnumType) return false;
  if (dataType === 'string' || dataType === 'number') return true;
  return false;
};

// export const constAuthMethodTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
//   if (uischema.type !== 'Control') return false;
//   //simple hack to get the control name. //TODO: find a better way
//   const arr = uischema.scope.split('/');
//   const controlName = arr[arr.length - 1];

//   const dataType = schema?.properties?.[controlName]?.type;

//   const isEnumType = schema?.properties?.[controlName]?.enum;
//   if (isEnumType) return false;
//   if (dataType === 'string' || dataType === 'number') return true;
//   return false;
// };

// jsonforms dropdown control tester
export const dropdownControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];

  const isEnumType = !!schema?.properties?.[controlName]?.enum;
  // const hasOneOf = schema?.properties?.[controlName]?.oneOf ? true : false;

  return isEnumType;
};

// jsonforms custom control tester
export const customControlTester = (uischema: any, schema: JsonSchema, context: TesterContext, fields: any[]) => {
  if (uischema.type !== 'Control') return false;
  return fields.some((prop) => uischema.scope.endsWith(prop));
};

// jsonforms input control tester
export const arrayControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];

  const dataType = schema?.properties?.[controlName]?.type;

  if (dataType === 'array') return true;
  return false;
};

// jsonforms input control tester
export const oneOfControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];

  const hasOneOfType = !!schema?.properties?.[controlName]?.oneOf;
  const hasOauthInCredentials =
    schema?.properties?.credentials && schema?.properties?.credentials?.title?.toLowerCase().includes('oauth');

  return !!(hasOneOfType || hasOauthInCredentials);
};

export const jsonFormValidator = (schema: any, data: any) => {
  const ajv = createAjv({ useDefaults: true });
  const validate = ajv.compile(schema);

  const valid = validate(data);

  if (!valid) {
    return {
      valid: false,
      errors: (validate as any).errors.map((error: any) => {
        return {
          message: error.message,
          path: error.dataPath
        };
      })
    };
  }
  return { valid: true, errors: [] };
};

export const jsonFormRemoveAdditionalFields = (schema: any, data: any) => {
  const ajv = new Ajv({ removeAdditional: 'all' });

  const validate = ajv.compile(schema);
  let xdata = { ...data };
  validate(xdata);
  return xdata;
};

export type FormStatus = 'submitting' | 'success' | 'error' | 'empty';
