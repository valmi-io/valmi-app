/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 8:38:13 pm
 * Author: Nagendra S @ valmi.io
 */

import FormArrayControl from '@/components/FormInput/FormArrayControl';
import FormEmptyControl from '@/components/FormInput/FormEmptyControl';
import FormInputControl from '@/components/FormInput/FormInputControl';
import FormSelectControl from '@/components/FormInput/FormSelectControl';
import StreamKeysControl from '@/components/FormInput/StreamKeysControl';
import { inputControlTester, customControlTester, dropdownControlTester, arrayControlTester } from '@/utils/form-utils';
import { isArray } from '@/utils/lib';
import { rankWith } from '@jsonforms/core';
import { materialRenderers } from '@jsonforms/material-renderers';

const apiKeys = ['publicKeys', 'privateKeys'];

type CustomRenderersProps = {
  invisibleFields: string[];
};

export const getCustomRenderers = ({ invisibleFields }: CustomRenderersProps) => {
  return [
    ...materialRenderers,
    {
      tester: rankWith(
        4000, //increase rank as needed
        (uiSchema, schema, context) => customControlTester(uiSchema, schema, context, apiKeys)
      ),
      renderer: StreamKeysControl
    },

    isArray(invisibleFields) &&
      invisibleFields.length && {
        tester: rankWith(
          3000, //increase rank as needed
          (uiSchema, schema, context) => customControlTester(uiSchema, schema, context, invisibleFields)
        ),
        renderer: FormEmptyControl
      },

    {
      tester: rankWith(
        2000, //increase rank as needed
        inputControlTester
      ),
      renderer: FormInputControl
    },
    {
      tester: rankWith(
        2000, //increase rank as needed
        dropdownControlTester
      ),
      renderer: FormSelectControl
    },
    {
      tester: rankWith(
        3000, //increase rank as needed
        arrayControlTester
      ),
      renderer: FormArrayControl
    }
  ];
};
