import { ControlProps } from '@jsonforms/core';
import { Unwrapped   } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, Card, Grid } from '@mui/material';
const { MaterialTextControl } = Unwrapped;

export const InputControl = (props: ControlProps) => {
  console.log(props);
  return (
        <Card variant="outlined" sx={{my: 10}}>
        <MaterialTextControl   {...props} />
        </Card>
  );
};

export default  withJsonFormsControlProps(InputControl);
