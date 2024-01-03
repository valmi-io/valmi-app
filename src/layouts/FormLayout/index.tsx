/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 7:31:24 pm
 * Author: Nagendra S @ valmi.io
 */

import { styled, Box, Divider, Stack } from '@mui/material';

interface layoutProps {
  formFields?: React.ReactNode;
  instructions?: React.ReactNode;
}

export const FormContainer = styled(Stack)(({}) => ({
  display: 'flex',
  width: '50%'
}));

const Layout = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
}));

const FormLayout = ({ formFields, instructions }: layoutProps) => {
  return (
    <Layout>
      {/* display fields */}
      {formFields}

      <Divider sx={{ m: 0.5 }} orientation="vertical" />
      {/* Display Instructions content */}
      <Box
        sx={{
          width: '40%'
        }}
      >
        {instructions}
      </Box>
    </Layout>
  );
};

export default FormLayout;
