import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, Card, Grid } from '@mui/material';
import { MaterialTextControl } from './CustomMaterialTextControl';

export const InputControl = (props: ControlProps) => {
  //console.log(props);
  return (
        <Card sx={{py: 10}}>
        <MaterialTextControl    {...props} />
        </Card>
  );
};

export default  withJsonFormsControlProps(InputControl);
