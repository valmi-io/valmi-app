/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:16:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps, isDescriptionHidden } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, FormHelperText, Hidden, TextField } from '@mui/material';
import { merge } from 'lodash';
import { useDebouncedChange, useFocus } from '@jsonforms/material-renderers';
import moment from 'moment';

const isDateFormat = (schema: any) => {
  return !!(schema?.format === 'date-time');
};

export const FormInputControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    data,
    description,
    schema,
    uischema,
    path,
    errors,
    enabled,
    visible,
    id,
    handleChange,
    required,
    label,
    config
  } = props;

  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  // delay in milliseconds
  // input gets disabled & displays error after this delay.
  let timeout = 1000;

  const eventToValue = (ev: any) => {
    const val = ev.target.value;

    if (!val) return undefined;

    if (isDateFormat(schema)) return new Date(val).toISOString();
    return val;
  };

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue, timeout);

  let val = inputText;

  if (isDateFormat(schema)) {
    const date = moment(val);

    const formattedDate = date.format('YYYY-MM-DD');

    val = formattedDate.toString();
  }

  return (
    <Hidden xsUp={!visible}>
      <Card sx={{ py: 2 }}>
        {visible && (
          <FormControl
            fullWidth={!appliedUiSchemaOptions.trim}
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            variant={'standard'}
          >
            <TextField
              label={label}
              type={schema?.format === 'date-time' ? 'date' : ''}
              required={required}
              value={val}
              disabled={!enabled}
              title={schema.title}
              error={!isValid}
              onChange={onChange}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <FormHelperText error={!isValid && !showDescription}>{firstFormHelperText}</FormHelperText>
            <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
          </FormControl>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsControlProps(FormInputControl);
