/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 5:16:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { ControlProps, isDescriptionHidden } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Card, FormControl, FormHelperText, Hidden, TextField } from '@mui/material';
import { merge } from 'lodash';
import { useDebouncedChange, useFocus } from '@jsonforms/material-renderers';
// import { MaterialTextControl } from '@/tmp/CustomMaterialTextControl';

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

  const eventToValue = (ev: any) => (ev.target.value === '' ? undefined : ev.target.value);

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue);

  return (
    <Hidden xsUp={!visible}>
      <Card sx={{ py: 2 }}>
        {/* <MaterialTextControl {...props} /> */}
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
              required={required}
              value={inputText}
              disabled={!enabled}
              title={schema.title}
              error={!isValid}
              placeholder={schema.placeholder}
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
