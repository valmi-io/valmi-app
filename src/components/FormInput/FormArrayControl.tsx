/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 10th 2024, 9:39:18 am
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps, isDescriptionHidden } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, FormHelperText, Hidden, MenuItem, TextField } from '@mui/material';
import { merge } from 'lodash';
import { useDebouncedChange, useFocus } from '@jsonforms/material-renderers';

export const FormArrayControl = (props: ControlProps) => {
  console.log('Form array control:_', props);

  //   const {
  //     data,
  //     description,
  //     schema,
  //     uischema,
  //     path,
  //     errors,
  //     enabled,
  //     visible,
  //     id,
  //     handleChange,
  //     required,
  //     label,
  //     config
  //   } = props;

  return <div>Array Component</div>;
};

export default withJsonFormsControlProps(FormArrayControl);
