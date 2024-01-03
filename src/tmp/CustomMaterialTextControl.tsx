import React from 'react';
import { ControlProps, isStringControl, RankedTester, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { MuiInputText } from './CustomMuiText';
import { MaterialInputControl } from './CustomMaterialInputControl';

export const MaterialTextControl = (props: ControlProps) => <MaterialInputControl {...props} input={MuiInputText} />;

export const materialTextControlTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsControlProps(MaterialTextControl);
