/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:00:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, Hidden, MenuItem, TextField, Typography } from '@mui/material';
import { merge } from 'lodash';
import { useDebouncedChange, useFocus } from '@jsonforms/material-renderers';

export const FormSelectControl = (props: ControlProps) => {
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

  const eventToValue = (ev: any) => (ev.target.value === '' ? undefined : ev.target.value);

  const formErrorHelperText = !isValid ? errors : null;

  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue);

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
              size="small"
              label={label}
              select={true}
              required={required}
              disabled={!enabled}
              value={inputText}
              onChange={onChange}
              InputLabelProps={{
                shrink: true
              }}
            >
              {schema.enum?.map((item: string) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </TextField>

            <Typography color={!isValid ? 'error.main' : 'primary.main'} variant="body2">
              {formErrorHelperText?.toLowerCase() ?? ''}
            </Typography>
          </FormControl>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsControlProps(FormSelectControl);
