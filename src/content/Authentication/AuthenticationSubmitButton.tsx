import React from 'react';

import { CheckOutlined } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';

interface AuthenticationSubmitButtonProps {
  buttonText: string;
  isFetching: boolean;
  data: any;
}

const AuthenticationSubmitButton: React.FC<AuthenticationSubmitButtonProps> = ({
  buttonText,
  isFetching,
  data
}) => {
  let endIcon = null;
  endIcon = isFetching && (
    <CircularProgress size={16} sx={{ color: 'white' }} />
  );
  if (data) {
    endIcon = <CheckOutlined fontSize="small" />;
  }

  return (
    <Button
      type="submit"
      fullWidth={true}
      variant="contained"
      color="primary"
      size="large"
      endIcon={endIcon}
      sx={{ mt: 2 }}
    >
      {buttonText}
    </Button>
  );
};

export default AuthenticationSubmitButton;
