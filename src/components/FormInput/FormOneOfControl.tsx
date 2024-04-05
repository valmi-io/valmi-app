import React from 'react';
import { ControlProps, isOneOfEnumControl, OwnPropsOfEnum, RankedTester, rankWith } from '@jsonforms/core';
import { TranslateProps, withJsonFormsOneOfEnumProps, withTranslateProps } from '@jsonforms/react';
// import { MuiAutocomplete, WithOptionLabel } from '/mui-controls/MuiAutocomplete';
// import { MuiSelect } from '../mui-controls/MuiSelect';
// import { MaterialInputControl } from '../controls/MaterialInputControl';
import merge from 'lodash/merge';
import { MuiAutocomplete, WithOptionLabel } from '@/components/mui-controls/MuiAutoComplete';
import FormInputControl from '@/components/FormInput/FormInputControl';

export const MaterialOneOfEnumControl = (props: ControlProps & OwnPropsOfEnum & WithOptionLabel & TranslateProps) => {
  console.log('Material one of enum control: ', props);
  const { config, uischema, errors, data } = props;

  console.log('Data:_', data);
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  console.log('applied ui options:_', appliedUiSchemaOptions);

  const isValid = errors?.length === 0;

  return <></>;

  //   return appliedUiSchemaOptions.autocomplete === false ? (
  //     <MaterialInputControl {...props} input={MuiSelect} />
  //   ) : (
  //     <MuiAutocomplete {...props} isValid={isValid} />
  //   );
};

export const materialOneOfEnumControlTester: RankedTester = rankWith(5, isOneOfEnumControl);

// HOC order can be reversed with https://github.com/eclipsesource/jsonforms/issues/1987
export default withJsonFormsOneOfEnumProps(withTranslateProps(React.memo(MaterialOneOfEnumControl)), false);
