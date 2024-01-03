/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:35:47 pm
 * Author: Nagendra S @ valmi.io
 */

import FormEmptyControl from '@/components/FormInput/FormEmptyControl';
import FormInputControl from '@/components/FormInput/FormInputControl';
import StreamKeysControl from '@/tmp/StreamKeysControl';
import { invisibleControlTester, inputControlTester } from '@/utils/form-utils';
import { JsonSchema, TesterContext, rankWith } from '@jsonforms/core';
import { materialRenderers } from '@jsonforms/material-renderers';

const invisibleProperties = ['id', 'workspaceId', 'type'];

const apiKeys = ['publicKeys', 'privateKeys'];
const apiKeysTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return apiKeys.some((prop) => uischema.scope.endsWith(prop));
};

export const createStreamCustomRenderers = [
  ...materialRenderers,
  {
    tester: rankWith(
      4000, //increase rank as needed
      apiKeysTester
    ),
    renderer: StreamKeysControl
  },
  {
    tester: rankWith(
      3000, //increase rank as needed
      (uiSchema, schema, context) => invisibleControlTester(uiSchema, schema, context, invisibleProperties)
    ),
    renderer: FormEmptyControl
  },
  {
    tester: rankWith(
      2000, //increase rank as needed
      inputControlTester
    ),
    renderer: FormInputControl
  }
];
