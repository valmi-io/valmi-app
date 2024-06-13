// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 3:37:50 pm
 * Author: Nagendra S @ valmi.io
 */

import { Translator, UISchemaElement, createAjv } from '@jsonforms/core';
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

  return !!(hasOneOfType && hasOauthInCredentials);
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

export type formValidationMode = 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';

export const translateFormError = (error: any, translate: Translator, uischema?: UISchemaElement) => {
  const { keyword = '', message = '' } = error;

  if (keyword && formErrors[keyword]) {
    return formErrors[keyword];
  }

  return message;
};

const formErrors = {
  const: 'field is required',
  required: 'field is required'
};
