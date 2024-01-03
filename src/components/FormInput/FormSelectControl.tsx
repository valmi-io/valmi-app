/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:00:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps, isDescriptionHidden } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, FormHelperText, Hidden, MenuItem, TextField } from '@mui/material';
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

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const eventToValue = (ev: any) => (ev.target.value === '' ? undefined : ev.target.value);

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

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

            <FormHelperText error={!isValid && !showDescription}>{firstFormHelperText}</FormHelperText>
            <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
          </FormControl>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsControlProps(FormSelectControl);
