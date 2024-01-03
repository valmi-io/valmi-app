import React, { useEffect } from 'react';
import { ControlProps, isDescriptionHidden } from '@jsonforms/core';

import { Hidden } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
import merge from 'lodash/merge';
import { useFocus } from '@jsonforms/material-renderers';

export interface WithInput {
  input: any;
}

export const MaterialInputControl = (props: ControlProps & WithInput) => {
  const [focused, onFocus, onBlur] = useFocus();
  const { id, description, errors, label, uischema, visible, required, config, input } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;
  const InnerComponent = input;

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
        variant={'standard'}
      >
        {/* <InputLabel
          htmlFor={id + '-input'}
          error={!isValid}
          required={showAsRequired(required,
            appliedUiSchemaOptions.hideRequiredAsterisk)}
        >
          {label}
        </InputLabel> */}

        <InnerComponent {...props} id={id + '-input'} isValid={isValid} visible={visible} />
        <FormHelperText error={!isValid && !showDescription}>{firstFormHelperText}</FormHelperText>
        <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
      </FormControl>
    </Hidden>
  );
};
