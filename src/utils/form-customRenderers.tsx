/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 8:38:13 pm
 * Author: Nagendra S @ valmi.io
 */

import FormArrayControl from '@/components/FormInput/FormArrayControl';
import FormEmptyControl from '@/components/FormInput/FormEmptyControl';
import FormInputControl from '@/components/FormInput/FormInputControl';
import MaterialOneOfEnumControl from '@/components/FormInput/FormOneOfControl';
import FormSelectControl from '@/components/FormInput/FormSelectControl';
import StreamKeysControl from '@/components/FormInput/StreamKeysControl';
import {
  inputControlTester,
  customControlTester,
  dropdownControlTester,
  arrayControlTester,
  oneOfControlTester
} from '@/utils/form-utils';
import { isArray } from '@/utils/lib';
import { isOneOfEnumControl, rankWith } from '@jsonforms/core';
import { materialRenderers } from '@jsonforms/material-renderers';

const apiKeys = ['publicKeys', 'privateKeys'];

type CustomRenderersProps = {
  invisibleFields?: string[];
};

export const getCustomRenderers = ({ invisibleFields = [] }: CustomRenderersProps) => {
  const renderers = [
    ...materialRenderers,

    {
      tester: rankWith(
        4000, // Increase rank as needed
        (uiSchema, schema, context) => customControlTester(uiSchema, schema, context, apiKeys)
      ),
      renderer: StreamKeysControl
    },
    {
      tester: rankWith(
        2000, // Increase rank as needed
        inputControlTester
      ),
      renderer: FormInputControl
    },
    {
      tester: rankWith(
        2000, // Increase rank as needed
        dropdownControlTester
      ),
      renderer: FormSelectControl
    },
    {
      tester: rankWith(
        3000, // Increase rank as needed
        arrayControlTester
      ),
      renderer: FormArrayControl
    },
    {
      tester: rankWith(
        3000, // Increase rank as needed
        oneOfControlTester
      ),
      renderer: MaterialOneOfEnumControl
    }
  ];

  if (isArray(invisibleFields) && invisibleFields.length > 0) {
    renderers.push({
      tester: rankWith(
        5000, // Increase rank as needed
        (uiSchema, schema, context) => customControlTester(uiSchema, schema, context, invisibleFields)
      ),
      renderer: FormEmptyControl
    });
  }

  return renderers;
};
