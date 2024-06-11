/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 7:31:24 pm
 * Author: Nagendra S @ valmi.io
 */

import { styled, Box, Divider, Stack } from '@mui/material';

interface layoutProps {
  formComp?: JSX.Element;
  instructionsComp?: JSX.Element;
}

export const FormContainer = styled(Stack)(({}) => ({
  display: 'flex',
  width: '100%'
}));

const FormLayout = ({ formComp: FormComp, instructionsComp: InstructionsComp }: layoutProps) => {
  return (
    <Stack direction="row" divider={<Divider sx={{ mx: 1 }} orientation="vertical" flexItem />}>
      <Box sx={{ width: '70%' }}>
        {/* display fields */} {FormComp && FormComp}
      </Box>

      <Box sx={{ width: '50%' }}>{InstructionsComp && InstructionsComp}</Box>
    </Stack>
  );
};

export default FormLayout;
