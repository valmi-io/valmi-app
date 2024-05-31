import { Alert, Snackbar, styled } from '@mui/material';

export interface AlertComponentProps {
  open: boolean;
  onClose: () => void;
  message: string;
  isError?: boolean; // Optional prop to indicate if the alert is an error
}

// Possible statuses for the alert
export type AlertStatus = 'empty' | 'success' | 'error';

// Structure of the alert type
export type AlertType = {
  message: string;
  show: boolean;
  type: AlertStatus;
};

// Styled component for the AlertContainer
const AlertContainer = styled(Alert)(({}) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center'
}));

// Styled component for the SnackbarContainer
const SnackbarContainer = styled(Snackbar)(({}) => ({
  alignItems: 'center'
}));

const AlertComponent = ({ open, onClose, message, isError }: AlertComponentProps) => {
  return (
    <SnackbarContainer
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      onClose={onClose}
    >
      <AlertContainer onClose={onClose} severity={isError ? 'error' : 'success'}>
        {message}
      </AlertContainer>
    </SnackbarContainer>
  );
};

export default AlertComponent;
