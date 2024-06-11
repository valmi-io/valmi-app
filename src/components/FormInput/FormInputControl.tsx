/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:16:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps, JsonSchema } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, Hidden, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { merge } from 'lodash';
import { useDebouncedChange, useFocus } from '@jsonforms/material-renderers';
import moment from 'moment';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const isDateFormat = (schema: any) => {
  return !!(schema?.format === 'date');
};

const isDateTimeFormat = (schema: any) => {
  return !!(schema?.format === 'date-time');
};

const isPasswordFormat = (schema: any) => {
  return !!(schema?.format === 'password');
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

  const [showInput, setShowInput] = useState(false);

  const handleClick = () => setShowInput((show) => !show);

  // delay in milliseconds
  // input gets disabled & displays error after this delay.
  let timeout = 1000;

  const eventToValue = (ev: any) => {
    const val = ev.target.value;

    if (!val) return undefined;

    if (isDateTimeFormat(schema)) return new Date(val).toISOString();
    return val;
  };

  console.log('form error helper text:-', errors);

  const formErrorHelperText = !isValid ? errors : null;

  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue, timeout);

  let val = inputText;

  if (isDateTimeFormat(schema)) {
    const date = moment(val);

    const formattedDate = date.format('YYYY-MM-DD');

    val = formattedDate.toString();
  }

  const getInputType = (schema: JsonSchema, show: boolean) => {
    if (isDateFormat(schema) || isDateTimeFormat(schema)) {
      return 'date';
    }

    if (isPasswordFormat(schema)) return show ? 'text' : 'password';
    return '';
  };

  return (
    <Hidden xsUp={!visible}>
      <Card sx={{ py: 2 }}>
        {visible && (
          <Tooltip title={description ? description : ''} placement="top-start">
            <FormControl
              fullWidth={!appliedUiSchemaOptions.trim}
              onFocus={onFocus}
              onBlur={onBlur}
              id={id}
              variant={'standard'}
            >
              <TextField
                label={label}
                type={getInputType(schema, showInput)}
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
                InputProps={{
                  endAdornment: isPasswordFormat(schema) && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClick} edge="end">
                        {showInput ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Typography color={!isValid ? 'error.main' : 'primary.main'} variant="body2">
                {formErrorHelperText?.toLowerCase() ?? ''}
              </Typography>
            </FormControl>
          </Tooltip>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsControlProps(FormInputControl);
